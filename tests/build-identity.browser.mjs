import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const { version } = JSON.parse(readFileSync('version.json', 'utf8'));
const browser = await chromium.launch({ channel:'chrome', headless:true });
try {
  const page = await browser.newPage({viewport:{width:1024,height:850}});
  await page.goto('http://127.0.0.1:49418/');
  const icon = page.getByRole('button',{name:'Watch Natally point to her natal chart'}).first();
  await icon.waitFor();
  assert.equal(await page.getByText('v'+version,{exact:true}).isVisible(),true,'initial sign-in screen shows the canonical version');
  const alpha = await page.evaluate(async()=>{
    const image = new Image(); image.src='/favicon-32.png'; await image.decode();
    const canvas=document.createElement('canvas'); canvas.width=canvas.height=32;
    const pixels=canvas.getContext('2d'); pixels.drawImage(image,0,0);
    return [[0,0],[31,0],[0,31],[31,31]].map(([x,y])=>pixels.getImageData(x,y,1,1).data[3]);
  });
  assert.deepEqual(alpha,[0,0,0,0]);
  await icon.click();
  await page.waitForFunction(()=>document.querySelector('.natally-brand-icon')?.classList.contains('is-guiding'));
  await page.waitForTimeout(500);
  await page.screenshot({path:`dist/natally-ai-studio-v${version}-web-icon-gesture.png`});
  console.log(`PASS production sign-in stamp v${version}, four transparent favicon corners, and guiding gesture`);
} finally { await browser.close(); }
