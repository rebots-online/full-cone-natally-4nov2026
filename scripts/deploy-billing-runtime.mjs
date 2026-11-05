// Actual Cloud Run deployment using the operator's existing Firebase CLI login.
// Credentials remain in captured process memory and Secret Manager; never source archives.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createKStoreClient, resolveEnvironment } from './environment.mjs';
import { updateBillingEnvironment } from './configure-billing-environment.mjs';
import { BILLING_SECRET_NAMES, selectBillingRuntimeEnv } from './billing-runtime-env.mjs';

const root=resolve('.');
const authPath=join(homedir(),'.config/configstore/firebase-tools.json');
let token='';
let buildRegion='us-central1';
async function operatorToken(){
  const d=JSON.parse(readFileSync(authPath,'utf8'));
  if(d.tokens?.access_token && d.tokens.expires_at>Date.now()+120000)return d.tokens.access_token;
  const cache=join(process.env.LOCALAPPDATA||join(homedir(),'AppData/Local'),'npm-cache/_npx');
  const cli=readdirSync(cache).map(n=>join(cache,n,'node_modules/firebase-tools/lib/bin/firebase.js')).find(existsSync);
  if(!cli)throw Error('Existing Firebase CLI installation is required to refresh deployment login');
  execFileSync(process.execPath,[cli,'projects:list','--json'],{stdio:['ignore','pipe','pipe'],windowsHide:true,timeout:60000});
  const refreshed=JSON.parse(readFileSync(authPath,'utf8'));
  if(!refreshed.tokens?.access_token)throw Error('Existing Firebase login could not refresh');
  return refreshed.tokens.access_token;
}
async function api(url,method='GET',body,allowed=[]){
  const r=await fetch(url,{method,headers:{Authorization:`Bearer ${token}`,...(body!==undefined?{'Content-Type':'application/json'}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(60000)});
  const d=await r.json().catch(()=>({}));
  if(!r.ok&&!allowed.includes(r.status))throw Error(`${method} ${new URL(url).host}${new URL(url).pathname}: HTTP ${r.status} ${d.error?.status||''} ${d.error?.message||''}`);
  return {status:r.status,data:d};
}
async function waitOperation(base,name){
  const buildMatch=base.includes('cloudbuild.googleapis.com')&&/^operations\/build\/([^/]+)\/([^/]+)$/.exec(name);
  const buildUrl=buildMatch?`${base}/projects/${buildMatch[1]}/locations/${buildRegion}/builds/${Buffer.from(buildMatch[2],'base64url').toString()}`:null;
  for(let attempt=0;attempt<180;attempt++){
    const {data}=await api(buildUrl||`${base}/${name}`);
    if(buildUrl){if(data.status==='SUCCESS')return data;if(['FAILURE','INTERNAL_ERROR','TIMEOUT','CANCELLED','EXPIRED'].includes(data.status))throw Error(`Build ${data.id} failed: ${data.status} ${data.failureInfo?.detail||''}`);}
    if(data.done){if(data.error)throw Error(`Operation ${name} failed: ${data.error.message}`);return data.response;}
    if(attempt%6===0)console.log(`Waiting for operation ${name}`);
    await new Promise(r=>setTimeout(r,5000));
    if(attempt%30===29)token=await operatorToken();
  }
  throw Error(`Operation remains pending: ${name}`);
}
async function addIam(url,member,role,condition){
  const projectPolicy=url.startsWith('https://cloudresourcemanager.googleapis.com/');
  const old=(await api(`${url}:getIamPolicy`,projectPolicy?'POST':'GET',projectPolicy?{options:{requestedPolicyVersion:3}}:undefined)).data;
  old.bindings??=[];
  let b=old.bindings.find(x=>x.role===role&&JSON.stringify(x.condition||null)===JSON.stringify(condition||null));
  if(b?.members?.includes(member))return;
  if(!b){b={role,members:[],...(condition?{condition}:{})};old.bindings.push(b);}
  b.members.push(member);old.version=3;
  await api(`${url}:setIamPolicy`,'POST',{policy:old});
}
async function deploy(){
  const {environment:env}=await resolveEnvironment({root,client:createKStoreClient()});
  for(const k of ['BILLING_GCP_PROJECT','BILLING_GCP_REGION','BILLING_GCP_SERVICE','OPENROUTER_ADMIN_KEY','BILLING_KEY_ENCRYPTION_KEY','BILLING_REDEMPTION_CODE','BILLING_REDEMPTION_ALLOWANCE_USD','BILLING_ALLOWED_ORIGIN'])if(!env[k])throw Error(`Required deployment binding missing: ${k}`);
  const project=env.BILLING_GCP_PROJECT,region=env.BILLING_GCP_REGION,service=env.BILLING_GCP_SERVICE;
  if(project!=='rochemediaservices-infra'||!['us-central1','us-west1'].includes(region))throw Error('Deployment target differs from the approved project and deployment regions');
  buildRegion=region;
  if(!existsSync('billing/server.mjs'))throw Error('Actual billing/server.mjs must exist before deployment');
  token=await operatorToken();
  const firebase=JSON.parse(readFileSync('firebase-applet-config.json','utf8'));
  const projectData=(await api(`https://cloudresourcemanager.googleapis.com/v1/projects/${project}`)).data;
  const number=projectData.projectNumber;
  const runtimeEmail=`${service}@${project}.iam.gserviceaccount.com`;
  const runtimeMember=`serviceAccount:${runtimeEmail}`;
  const runtimeResource=`https://iam.googleapis.com/v1/projects/${project}/serviceAccounts/${runtimeEmail}`;
  if((await api(runtimeResource,'GET',undefined,[404])).status===404)await api(`https://iam.googleapis.com/v1/projects/${project}/serviceAccounts`,'POST',{accountId:service,serviceAccount:{displayName:'Natally billing runtime'}});
  await addIam(`https://cloudresourcemanager.googleapis.com/v1/projects/${firebase.projectId}`,runtimeMember,'roles/datastore.user',{
    title:'natally-billing-named-database',description:'Natally billing access to the existing named database only',
    expression:`resource.name == "projects/${firebase.projectId}/databases/${firebase.firestoreDatabaseId}"`,
  });
  const secretNames=BILLING_SECRET_NAMES;
  const runtimeEnv=[];
  for(const name of secretNames){
    if(!env[name])continue;
    const id=`${service}-${name.toLowerCase().replaceAll('_','-')}`;
    const url=`https://secretmanager.googleapis.com/v1/projects/${project}/secrets/${id}`;
    if((await api(url,'GET',undefined,[404])).status===404)await api(`https://secretmanager.googleapis.com/v1/projects/${project}/secrets?secretId=${id}`,'POST',{replication:{automatic:{}}});
    const latest=await api(`${url}/versions/latest:access`,'GET',undefined,[403,404]);
    let version=latest.data.name?.split('/').at(-1);
    if(name==='REVENUECAT_CLI_PROFILE_JSON'){
      // A deployed CLI may have rotated OAuth since the canonical seed was read.
      // Never replace that newer profile with the installation seed on redeploy.
      const metadata=await api(`${url}/versions/latest`,'GET',undefined,[404]);
      if(metadata.status===404)await api(`${url}:addVersion`,'POST',{payload:{data:Buffer.from(env[name]).toString('base64')}});
      version='latest';
    }else if(latest.status!==200||Buffer.from(latest.data.payload?.data||'','base64').toString()!==env[name])version=(await api(`${url}:addVersion`,'POST',{payload:{data:Buffer.from(env[name]).toString('base64')}})).data.name.split('/').at(-1);
    try { await addIam(url,runtimeMember,'roles/secretmanager.secretAccessor'); }
    catch(error) {
      if(!error.message.includes('HTTP 403'))throw error;
      await addIam(`https://cloudresourcemanager.googleapis.com/v1/projects/${project}`,runtimeMember,'roles/secretmanager.secretAccessor',{
        title:`${service}-runtime-secret-${name.toLowerCase().replaceAll('_','-')}`,
        description:'Read only the named Natally runtime credential',
        expression:`resource.name.startsWith("projects/${number}/secrets/${id}/") || resource.name == "projects/${number}/secrets/${id}"`,
      });
    }
    runtimeEnv.push({name,valueSource:{secretKeyRef:{secret:id,version}}});
    if(name==='REVENUECAT_CLI_PROFILE_JSON'){
      runtimeEnv.push({name:'REVENUECAT_CLI_PROFILE_SECRET_RESOURCE',value:`projects/${project}/secrets/${id}`});
      await addIam(`https://cloudresourcemanager.googleapis.com/v1/projects/${project}`,runtimeMember,'roles/secretmanager.secretVersionAdder',{
        title:`${service}-renew-revenuecat-profile`,description:'Persist refreshed RevenueCat OAuth only in its existing runtime profile secret',
        expression:`resource.name == "projects/${number}/secrets/${id}"`,
      });
    }
  }
  for(const [name,value] of Object.entries(selectBillingRuntimeEnv(env).plain))runtimeEnv.push({name,value});
  const repoUrl=`https://artifactregistry.googleapis.com/v1/projects/${project}/locations/${region}/repositories/${service}`;
  if((await api(repoUrl,'GET',undefined,[404])).status===404){const op=(await api(`https://artifactregistry.googleapis.com/v1/projects/${project}/locations/${region}/repositories?repositoryId=${service}`,'POST',{format:'DOCKER',description:'Natally billing production images'})).data;await waitOperation('https://artifactregistry.googleapis.com/v1',op.name);}
  const bucket=`${project}-${service}-source`;
  if((await api(`https://storage.googleapis.com/storage/v1/b/${bucket}`,'GET',undefined,[404])).status===404)await api(`https://storage.googleapis.com/storage/v1/b?project=${project}`,'POST',{name:bucket,location:region,iamConfiguration:{uniformBucketLevelAccess:{enabled:true}}});
  const builder=`${number}-compute@developer.gserviceaccount.com`;
  try { await addIam(repoUrl,`serviceAccount:${builder}`,'roles/artifactregistry.writer'); }
  catch(error) {
    if(!error.message.includes('HTTP 403'))throw error;
    await addIam(`https://cloudresourcemanager.googleapis.com/v1/projects/${project}`,`serviceAccount:${builder}`,'roles/artifactregistry.writer',{
      title:'natally-billing-build-repository',description:'Push only the Natally billing image repository',
      expression:`resource.name.startsWith("projects/${project}/locations/${region}/repositories/${service}")`,
    });
  }
  await addIam(`https://cloudresourcemanager.googleapis.com/v1/projects/${project}`,`serviceAccount:${builder}`,'roles/logging.logWriter');
  const bucketPolicyUrl=`https://storage.googleapis.com/storage/v1/b/${bucket}/iam`;
  const bp=(await api(bucketPolicyUrl)).data;bp.bindings??=[];let binding=bp.bindings.find(b=>b.role==='roles/storage.objectViewer');if(!binding){binding={role:'roles/storage.objectViewer',members:[]};bp.bindings.push(binding);}if(!binding.members.includes(`serviceAccount:${builder}`)){binding.members.push(`serviceAccount:${builder}`);await api(bucketPolicyUrl,'PUT',bp);}
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');const staging=join(root,'build',`billing-runtime-${stamp}`);mkdirSync(join(staging,'billing'),{recursive:true});
  for(const name of readdirSync('billing'))if(name.endsWith('.mjs')&&!name.includes('.test.'))copyFileSync(join('billing',name),join(staging,'billing',name));
  copyFileSync('firebase-applet-config.json',join(staging,'firebase-applet-config.json'));
  writeFileSync(join(staging,'Dockerfile'),[
    'FROM node:24-bookworm-slim','WORKDIR /app',
    'RUN npm install --prefix /opt/natally-cli --omit=dev @revenuecat/cli@0.1.7 && node -e "const r=require(\'module\').createRequire(\'/opt/natally-cli/node_modules/@revenuecat/cli/bin/rc.js\');require(\'fs\').symlinkSync(r.resolve(\'@revenuecat/cli-linux-x64/bin/rc\'),\'/usr/local/bin/natally-revenuecat\')"',
    'COPY billing ./billing','COPY firebase-applet-config.json ./firebase-applet-config.json',
    'ENV NODE_ENV=production','ENV REVENUECAT_CLI_EXECUTABLE=/usr/local/bin/natally-revenuecat',
    'USER node','CMD ["node", "billing/server.mjs"]','',
  ].join('\n'));
  const archive=staging+'.tar.gz';execFileSync('tar',['-czf',archive,'-C',staging,'.'],{windowsHide:true});
  const bytes=readFileSync(archive),hash=createHash('sha256').update(bytes).digest('hex');
  const object=`${service}/${hash}.tar.gz`;
  const upload=await fetch(`https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(object)}`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/gzip'},body:bytes,signal:AbortSignal.timeout(60000)});
  if(!upload.ok)throw Error(`Source upload HTTP ${upload.status}`);
  const image=`${region}-docker.pkg.dev/${project}/${service}/runtime:${hash.slice(0,20)}`;
  const build=(await api(`https://cloudbuild.googleapis.com/v1/projects/${project}/locations/${region}/builds`,'POST',{
    source:{storageSource:{bucket,object}},steps:[{name:'gcr.io/cloud-builders/docker',args:['build','-t',image,'.']}],images:[image],
    serviceAccount:`projects/${project}/serviceAccounts/${builder}`,options:{logging:'CLOUD_LOGGING_ONLY'},timeout:'600s',
  })).data;
  console.log(`Building actual runtime: ${build.name}`);
  writeFileSync(join(staging,'deployment.json'),JSON.stringify({project,region,service,sourceSha256:hash,buildOperation:build.name,image},null,2));
  const built=await waitOperation('https://cloudbuild.googleapis.com/v1',build.name);
  if(built.status!=='SUCCESS')throw Error(`Cloud Build result: ${built.status}`);
  const digest=built.results?.images?.[0]?.digest;
  const imageRef=digest?image.replace(/:[^/:]+$/,'')+'@'+digest:image;
  const serviceUrl=`https://run.googleapis.com/v2/projects/${project}/locations/${region}/services/${service}`;
  const found=await api(serviceUrl,'GET',undefined,[404]);
  const body={name:`projects/${project}/locations/${region}/services/${service}`,ingress:'INGRESS_TRAFFIC_ALL',template:{serviceAccount:runtimeEmail,scaling:{minInstanceCount:0,maxInstanceCount:3},containers:[{image:imageRef,ports:[{containerPort:8080}],env:runtimeEnv,resources:{limits:{cpu:'1',memory:'512Mi'}}}]}};
  if(found.status===404)delete body.name;
  const deployed=(await api(found.status===404?`https://run.googleapis.com/v2/projects/${project}/locations/${region}/services?serviceId=${service}`:serviceUrl+'?updateMask=template,ingress',found.status===404?'POST':'PATCH',body)).data;
  await waitOperation('https://run.googleapis.com/v2',deployed.name);
  await addIam(serviceUrl,'allUsers','roles/run.invoker');
  const current=(await api(serviceUrl)).data;
  // Cloud Run's frontend reserves /healthz; use the application's billing path.
  console.log(`Runtime deployed at ${current.uri}`);
  let health;
  for(let attempt=0;attempt<12;attempt++){
    health=await fetch(current.uri+'/billing/health',{signal:AbortSignal.timeout(30000)});
    if(health.ok)break;
    await new Promise(resolve=>setTimeout(resolve,3000));
  }
  if(!health.ok)throw Error(`Runtime health returned HTTP ${health.status}`);
  await updateBillingEnvironment({VITE_BILLING_API_URL:current.uri},{checkpoint:'billing-runtime-url'});
  const evidence={project,region,service,url:current.uri,revision:current.latestReadyRevision,sourceSha256:hash,image:imageRef,buildOperation:build.name,healthStatus:health.status,deployedAt:new Date().toISOString()};
  writeFileSync(join(staging,'deployment.json'),JSON.stringify(evidence,null,2)+'\n');
  console.log(JSON.stringify(evidence));
}
deploy().catch(error=>{console.error(error.message);process.exitCode=1;});
