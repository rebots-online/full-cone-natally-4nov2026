# The sole test-build entry point. Stamp once, attempt the full requested matrix.
[CmdletBinding()]
param(
    [switch]$Continue,
    [switch]$BuildOnly,
    [switch]$DeployWebFirst,
    [ValidateRange(1,255)][int]$Major,
    [string]$DeployExisting = '',
    [string]$DeployDomains = '',
    [switch]$VerifyOnly,
    [string]$WslDistribution = 'Ubuntu-24.04',
    [string]$WslUser = 'robin',
    [string]$BuildCache = 'E:\BuildCache\natally-ai-studio'
)
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false
$repo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Set-Location -LiteralPath $repo
if ($env:OS -ne 'Windows_NT') { throw 'This matrix requires the native Windows host for EXE/NSIS/MSI; run this script there.' }
if ($WslDistribution -ne 'Ubuntu-24.04') { throw 'Use the existing Ubuntu-24.04 distribution.' }
if ($Continue -and $PSBoundParameters.ContainsKey('Major')) { throw '-Continue cannot take -Major; a continuation reuses the already stamped version.' }
if ($DeployWebFirst -and ($Continue -or $BuildOnly -or $VerifyOnly -or $PSBoundParameters.ContainsKey('Major') -or $PSBoundParameters.ContainsKey('DeployExisting'))) { throw '-DeployWebFirst cannot be combined with -Continue, -BuildOnly, -VerifyOnly, -Major or -DeployExisting.' }
if (($PSBoundParameters.ContainsKey('DeployExisting') -or $VerifyOnly) -and ($Continue -or $PSBoundParameters.ContainsKey('Major'))) { throw 'Deployment switches cannot be combined with -Continue or -Major.' }
if ($VerifyOnly -and -not $DeployExisting) { throw '-VerifyOnly requires -DeployExisting pointing at a completed test-build inventory.' }
if ($PSBoundParameters.ContainsKey('DeployDomains') -and -not ($PSBoundParameters.ContainsKey('DeployExisting') -or $DeployWebFirst)) { throw '-DeployDomains requires -DeployExisting or -DeployWebFirst.' }
function Checked([string]$Executable, [string[]]$Arguments) {
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Executable failed with exit $LASTEXITCODE" }
}
function Import-ResolvedEnvironment {
    # Bounded coordinator handoff: verify the environment contract, capture the
    # resolved plain string/string map, then install process-only values.
    # Runs on Windows PowerShell 5.1 only: no -AsHashtable, UTF-8 explicit.
    Checked node @('scripts/environment.mjs','check')
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = 'node.exe'
    $psi.Arguments = 'scripts/environment.mjs resolve --json'
    $psi.WorkingDirectory = $repo
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.StandardOutputEncoding = [Text.Encoding]::UTF8
    $psi.StandardErrorEncoding = [Text.Encoding]::UTF8
    $proc = [Diagnostics.Process]::Start($psi)
    $resolveOutput = $proc.StandardOutput.ReadToEnd()
    $resolveError = $proc.StandardError.ReadToEnd()
    $proc.WaitForExit()
    if ($proc.ExitCode -ne 0) {
        if ($resolveError -match '\bfor ([A-Za-z_][A-Za-z0-9_]*):') { throw "Environment resolution failed for $($Matches[1]); no environment variables were installed" }
        throw 'environment resolve failed; no environment variables were installed'
    }
    $resolved = $null
    try { $resolved = $resolveOutput | ConvertFrom-Json -ErrorAction Stop }
    catch { throw 'environment resolve produced unreadable JSON; no environment variables were installed' }
    if ($null -eq $resolved -or $resolved -isnot [System.Management.Automation.PSCustomObject]) {
        throw 'environment resolve did not produce a plain map; no environment variables were installed'
    }
    foreach ($property in $resolved.PSObject.Properties) {
        if ($property.Name -notmatch '^[A-Za-z_][A-Za-z0-9_]*$' -or $property.Value -isnot [string]) {
            throw 'environment resolve produced an invalid binding name or value type; no environment variables were installed'
        }
    }
    foreach ($property in $resolved.PSObject.Properties) {
        [Environment]::SetEnvironmentVariable($property.Name, [string]$property.Value, 'Process')
        if ($property.Name -like 'VITE_*') {
            # WSLENV is COLON-delimited even on Windows; flags after '/' are kept.
            $entries = @($env:WSLENV -split ':' | Where-Object { $_ -ne '' })
            $baseName = ($property.Name -split '/')[0]
            if ($entries -notcontains $property.Name -and -not ($entries | Where-Object { ($_ -split '/')[0] -eq $baseName })) {
                $env:WSLENV = (@($entries) + $property.Name) -join ':'
            }
        }
    }
    $resolveOutput = $null
    $resolveError = $null
    $resolved = $null
}
Import-ResolvedEnvironment
if ($DeployWebFirst -and -not $DeployDomains -and -not $env:SURGE_DOMAINS) { throw '-DeployWebFirst requires -DeployDomains or SURGE_DOMAINS.' }
if ($PSBoundParameters.ContainsKey('DeployExisting')) {
    # Completed-artifact deployment (KStore rev8): verify the explicitly selected
    # historical inventory, then delegate publishing to the Node helper.
    if (-not (Test-Path -LiteralPath $DeployExisting)) { throw "Selected inventory does not exist: $DeployExisting" }
    if (-not $DeployDomains -and -not $env:SURGE_DOMAINS) { throw 'Deployment domains are required: pass -DeployDomains "natally.surge.sh,natally.robin.mba" or set SURGE_DOMAINS; no product-domain fallback.' }
    $domains = if ($DeployDomains) { $DeployDomains } else { $env:SURGE_DOMAINS }
    $env:NATALLY_DEPLOY_INVENTORY = $DeployExisting
    Checked node @('--input-type=module','-e',"const {verifyCompletedInventory}=await import('./scripts/release-state.mjs');const r=verifyCompletedInventory(process.env.NATALLY_DEPLOY_INVENTORY);console.log('Completed inventory verified:',r.selected.name);")
    $env:NATALLY_DEPLOY_COORDINATOR = '1'
    $deployArgs = @('scripts/deploy-existing.mjs','--inventory',$DeployExisting,'--domains',$domains)
    if ($VerifyOnly) { $deployArgs += '--verify-only' }
    Checked node $deployArgs
    return
}
New-Item -ItemType Directory -Force -Path (Join-Path $repo 'build') | Out-Null
$lockPath = Join-Path $repo 'build\matrix.lock'
$lock = [IO.File]::Open($lockPath, 'OpenOrCreate', 'ReadWrite', 'None')
$transcript = $false

function Read-State { Get-Content -LiteralPath (Join-Path $repo 'build\release-state.json') -Raw | ConvertFrom-Json }
function Mark-Failed([string[]]$Targets, [string]$Message) {
    $current = Read-State
    foreach ($target in $Targets) {
        if ($current.artifacts.$target.state -ne 'verified') { & node scripts/release-state.mjs fail $target $Message }
    }
}
function Stage([string]$Target, [string]$InputPath, [string]$Qualifier, [string]$Evidence) {
    Checked node @('scripts/release-state.mjs','stage',$Target,$InputPath,$Qualifier,$Evidence)
}
function Build-Web {
    $web = Join-Path $repo "build\$($state.prefix)-web-package"
    if ((Read-State).artifacts.web.state -ne 'verified') {
        Checked node @('scripts/build-web.mjs')
        New-Item -ItemType Directory -Force -Path $web | Out-Null
        $site = Join-Path $web 'site'
        if (Test-Path -LiteralPath $site) { throw 'Unverified web staging directory already exists; start a new matrix invocation.' }
        Copy-Item -LiteralPath (Join-Path $repo 'dist-web') -Destination $site -Recurse
        Copy-Item -LiteralPath scripts/install-web.sh,version.json -Destination $web
        if (-not (Select-String -LiteralPath (Join-Path $site 'index.html') -SimpleMatch "v$($state.version)" -Quiet)) { throw 'Web version label missing' }
        $zip = Join-Path $repo "build\$($state.prefix)-webapp.zip"
        Compress-Archive -Path (Join-Path $web '*') -DestinationPath $zip -CompressionLevel Optimal
        Checked python @('-m','zipfile','-t',$zip)
        Stage web $zip 'webapp.zip' "Web production bundle and visible v$($state.version); archive includes site, version and installer"
    }
    $pwaPath = Join-Path $repo 'dist-web/pwa-build.json'
    $pwa = Get-Content -LiteralPath $pwaPath -Raw | ConvertFrom-Json
    if ($pwa.version -ne $state.version -or $pwa.invocationId -ne $state.invocationId) { throw 'PWA release identity mismatch' }
    if (-not (Test-Path -LiteralPath (Join-Path $repo 'dist-web/sw.js'))) { throw 'PWA service worker missing' }
    Stage pwa $pwaPath 'pwa-build.json' 'Generated PWA shell inventory matches canonical release; device installation acceptance is separate'
    if ($script:wslReady) {
        Checked python @('scripts/run-command.py','--timeout','45','--','wsl','-d',$WslDistribution,'-u',$WslUser,'--','bash','-n',"$wslRepo/scripts/install-web.sh")
        foreach ($server in @('nginx','apache')) {
            Checked python @('scripts/run-command.py','--timeout','45','--','wsl','-d',$WslDistribution,'-u',$WslUser,'--','bash',"$wslRepo/scripts/install-web.sh",'--dry-run','--server',$server,'--domain','example.test','--destination','/var/www/natally-ai-studio','--package',"$wslRepo/build/$($state.prefix)-web-package")
        }
        $shellEvidence = 'Ubuntu 24.04 Bash'
    } else {
        # This checks generated server configuration, never builds Linux packages.
        $bash = 'E:\DevTools\msys64\usr\bin\bash.exe'
        $previousPath = $env:PATH
        try {
            $env:PATH = "$(Split-Path -Parent $bash);$previousPath"
            Checked $bash @('-n',"$($repo.Replace('\','/'))/scripts/install-web.sh")
            foreach ($server in @('nginx','apache')) {
                Checked $bash @("$($repo.Replace('\','/'))/scripts/install-web.sh",'--dry-run','--server',$server,'--domain','example.test','--destination','/var/www/natally-ai-studio','--package',$web.Replace('\','/'))
            }
        } finally {
            $env:PATH = $previousPath
        }
        $shellEvidence = 'Bash on native Windows (MSYS2)'
    }
    Stage web-installer (Join-Path $repo 'scripts\install-web.sh') 'install-web.sh' "nginx/Apache installer; syntax and both previews pass under $shellEvidence; target-server installation not exercised"
}
function Build-Windows {
    . (Join-Path $repo 'scripts\native-build-env.ps1') -Platform windows -BuildRoot $BuildCache
    Checked node @('scripts/release-state.mjs','check')
    & cargo tauri build --bundles nsis,msi -- --locked
    $result = $LASTEXITCODE
    $exe = Join-Path $env:CARGO_TARGET_DIR 'release\natally-ai-studio.exe'
    if (Test-Path -LiteralPath $exe) {
        $metadata = (Get-Item -LiteralPath $exe).VersionInfo
        if ($metadata.ProductVersion -eq $state.semverVersion) {
            Stage windows-exe $exe 'win11-x64-standalone.exe' "PE ProductVersion=$($metadata.ProductVersion); unsigned Tauri test, WebView2 required"
        }
    }
    foreach ($bundle in @(@{Target='nsis';Directory='nsis';Extension='exe'},@{Target='msi';Directory='msi';Extension='msi'})) {
        $directory = Join-Path $env:CARGO_TARGET_DIR "release\bundle\$($bundle.Directory)"
        if (Test-Path -LiteralPath $directory) {
            $artifact = Get-ChildItem -LiteralPath $directory -File | Where-Object { $_.Extension -eq ".$($bundle.Extension)" -and $_.Name.Contains($state.semverVersion) } | Select-Object -First 1
            if ($artifact) {
                if ($bundle.Target -eq 'msi') {
                    $installer = New-Object -ComObject WindowsInstaller.Installer
                    $database = $installer.OpenDatabase($artifact.FullName,0)
                    $view = $database.OpenView("SELECT Value FROM Property WHERE Property='ProductVersion'")
                    $view.Execute(); $record = $view.Fetch(); $embedded = $record.StringData(1)
                    if ($embedded -ne $state.msiVersion) { throw "MSI ProductVersion mismatch: $embedded" }
                }
                Stage $bundle.Target $artifact.FullName "win11-x64-$($bundle.Target).$($bundle.Extension)" "Tauri package version $($state.version); MSI numeric mapping $($state.msiVersion); unsigned test installer"
            }
        }
    }
    if ($result -ne 0) { throw "Windows build failed: $result; any valid available artifacts were staged" }
}
function Build-Android {
    . (Join-Path $repo 'scripts\native-build-env.ps1') -Platform android -BuildRoot $BuildCache
    $env:GRADLE_OPTS = '-Dorg.gradle.daemon=false'
    Checked node @('scripts/release-state.mjs','check')
    & cargo tauri android build --target aarch64 --apk --aab
    $result = $LASTEXITCODE
    $outputs = Join-Path $repo 'src-tauri\gen\android\app\build\outputs'
    $apk = Get-ChildItem -LiteralPath (Join-Path $outputs 'apk') -Recurse -File -Filter '*.apk' -ErrorAction SilentlyContinue | Where-Object { $_.Name.Contains($state.version) -and $_.Name -notlike '*unsigned*' } | Select-Object -First 1
    $aab = Get-ChildItem -LiteralPath (Join-Path $outputs 'bundle') -Recurse -File -Filter '*.aab' -ErrorAction SilentlyContinue | Where-Object { $_.Name.Contains($state.version) } | Select-Object -First 1
    $sdkTools = Join-Path $env:ANDROID_HOME 'build-tools\36.0.0'
    if ($apk) {
        Checked (Join-Path $sdkTools 'apksigner.bat') @('verify','--verbose','--print-certs',$apk.FullName)
        Checked (Join-Path $sdkTools 'zipalign.exe') @('-c','-P','16','4',$apk.FullName)
        $badging = & (Join-Path $sdkTools 'aapt.exe') dump badging $apk.FullName
        if ($LASTEXITCODE -ne 0 -or -not ($badging -match "versionName='$([regex]::Escape($state.version))'")) { throw 'APK embedded versionName mismatch' }
        Stage apk $apk.FullName 'android-arm64.apk' "Release profile; local Android test certificate; apksigner and 16 KiB zipalign pass; versionCode=$($state.versionCode)"
    }
    if ($aab) {
        $signature = & (Join-Path $env:JAVA_HOME 'bin\jarsigner.exe') -verify $aab.FullName 2>&1 | Out-String
        if ($LASTEXITCODE -ne 0 -or $signature -notmatch 'jar verified\.') { throw 'AAB JAR signature was not verified' }
        Checked python @('scripts/verify-android-symbols.py','--manifest-only',$aab.FullName,$state.version)
        Stage aab $aab.FullName 'android-arm64.aab' "Release profile, local Android test certificate; jarsigner verifies; versionCode=$($state.versionCode)"
        $symbols = Get-ChildItem -LiteralPath (Join-Path $outputs 'native-debug-symbols') -Recurse -File -Filter '*.zip' -ErrorAction SilentlyContinue | Select-Object -First 1
        $ndkBin = Join-Path $env:ANDROID_NDK_HOME 'toolchains\llvm\prebuilt\windows-x86_64\bin'
        if (-not $symbols) {
            $symbolZip = Join-Path $repo "build\$($state.prefix)-native-debug-symbols.zip"
            $nativeDirectory = Join-Path $env:CARGO_TARGET_DIR 'aarch64-linux-android\release'
            Checked python @('scripts/package-android-symbols.py',$aab.FullName,$nativeDirectory,(Join-Path $ndkBin 'llvm-objcopy.exe'),$symbolZip)
            $symbols = Get-Item -LiteralPath $symbolZip
        }
        $readelf = Join-Path $ndkBin 'llvm-readelf.exe'
        Checked python @('scripts/verify-android-symbols.py',$aab.FullName,$symbols.FullName,$readelf,$state.version)
        Stage android-symbols $symbols.FullName 'android-arm64-native-debug-symbols.zip' 'Native ELF build IDs match the AAB libraries and canonical AAB versionName'
    }
    if ($result -ne 0) { throw "Android build failed: $result; available artifacts were staged" }
}
function Build-Linux {
    if (-not $script:wslReady) { throw 'The existing Ubuntu-24.04 is not responding; no substitute distribution was created' }
    Checked wsl @('-d',$WslDistribution,'-u','root','--exec','bash',"$wslRepo/scripts/setup-linux-build-env.sh")
    $linuxTarget = $BuildCache.Replace('\','/').Replace('E:', '/mnt/e') + '/targets/linux'
    Checked wsl @('-d',$WslDistribution,'-u',$WslUser,'--exec','env',"NATALLY_RELEASE_ID=$($state.invocationId)","NATALLY_LINUX_TARGET=$linuxTarget",'bash',"$wslRepo/scripts/build-linux.sh")
}

try {
    if (-not $Continue) {
        # Windows checkouts may use CRLF. Normalize shell source before freezing.
        Get-ChildItem -LiteralPath (Join-Path $repo 'scripts') -Filter '*.sh' -File | ForEach-Object {
            $content = [IO.File]::ReadAllText($_.FullName).Replace("`r`n","`n")
            [IO.File]::WriteAllText($_.FullName,$content,(New-Object Text.UTF8Encoding($false)))
        }
        $stampArgs = @('scripts/release-state.mjs','stamp')
        if ($PSBoundParameters.ContainsKey('Major')) { $stampArgs += $Major }
        if ($BuildOnly) { $stampArgs += '--build-only' }
        Checked node $stampArgs
    }
    $state = Read-State
    $env:NATALLY_RELEASE_ID = $state.invocationId
    Start-Transcript -LiteralPath (Join-Path $repo "dist\$($state.prefix)-build.log") -Append | Out-Null
    $transcript = $true
    if ($DeployWebFirst) {
        # Publish the current web app before any native preparation or packaging.
        Checked npm.cmd @('ci','--cache', (Join-Path $BuildCache 'npm'))
        Checked node @('scripts/release-state.mjs','freeze')
        $env:NATALLY_BUILD_VERSION = $state.version
        $script:wslReady = $false
        Build-Web
        Checked node @('scripts/release-state.mjs','finish-web')
        $inventory = Join-Path $repo "dist\$($state.prefix)-test-build-inventory.json"
        $domains = if ($DeployDomains) { $DeployDomains } else { $env:SURGE_DOMAINS }
        $env:NATALLY_DEPLOY_INVENTORY = $inventory
        $env:NATALLY_DEPLOY_COORDINATOR = '1'
        Checked node @('scripts/deploy-existing.mjs','--inventory',$inventory,'--domains',$domains,'--web-first')
        return
    }
    if (-not $Continue -or $state.phase -eq 'preparing') {
        # Resume interrupted preparation using the existing coordinator stamp.
        . (Join-Path $repo 'scripts\native-build-env.ps1') -Platform windows -BuildRoot $BuildCache
        Checked npm.cmd @('ci','--cache', (Join-Path $BuildCache 'npm'))
        if (-not (Test-Path -LiteralPath src-tauri/gen/android/app/build.gradle.kts)) { Checked cargo @('tauri','android','init') }
        Checked node @('scripts/configure-android.mjs')
        Checked node @('scripts/prepare-icons.mjs')
        Checked npm.cmd @('run','lint')
        Checked node @('--test','tests/release-state.test.mjs')
        Checked node @('scripts/release-state.mjs','freeze')
    } else { Checked node @('scripts/release-state.mjs','verify-retained') }
    $env:NATALLY_BUILD_VERSION = $state.version
    $env:CARGO_BUILD_JOBS = '4'
    $wslRepo = (& python scripts/run-command.py --timeout 30 -- wsl -d $WslDistribution -u $WslUser --exec wslpath -a $repo | Out-String).Trim()
    $script:wslReady = $LASTEXITCODE -eq 0 -and $wslRepo.StartsWith('/mnt/')
    if (-not $script:wslReady) { Write-Warning 'Existing Ubuntu-24.04 did not answer the bounded preflight; collecting native Windows/Android and web results continues.' }
    foreach ($step in @(
        @{Name='Web';Targets=@('web','web-installer','pwa');Run={ Build-Web }},
        @{Name='Windows';Targets=@('windows-exe','nsis','msi');Run={ Build-Windows }},
        @{Name='Android';Targets=@('apk','aab','android-symbols');Run={ Build-Android }},
        @{Name='Linux';Targets=@('appimage','deb','rpm');Run={ Build-Linux }}
    )) {
        if ($Continue) {
            $current = Read-State
            $unfinished = @($step.Targets | Where-Object { $current.artifacts.$_.state -ne 'verified' })
            if ($unfinished.Count -eq 0) { Write-Host "Already verified: $($step.Name)"; continue }
        }
        Write-Host "Building $($step.Name) --- v$($state.version)"
        try { & $step.Run } catch { Write-Warning $_.Exception.Message; Mark-Failed $step.Targets $_.Exception.Message }
    }
    Checked node @('scripts/release-state.mjs','finish')
} catch {
    $failure = $_
    if ($DeployWebFirst -or (Read-State).phase -eq 'preparing') {
        $failedTargets = if ($DeployWebFirst) { @('web','web-installer','pwa') } else { (Read-State).required }
        foreach ($target in $failedTargets) { Mark-Failed @($target) "Preparation failed: $($failure.Exception.Message)" }
        if ($DeployWebFirst) { & node scripts/release-state.mjs finish-web } else { & node scripts/release-state.mjs finish }
    }
    throw $failure
} finally {
    if ($transcript) { Stop-Transcript | Out-Null }
    $lock.Dispose()
}
