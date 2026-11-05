# The sole test-build entry point. Stamp once, attempt the full requested matrix.
[CmdletBinding()]
param(
    [switch]$Continue,
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
New-Item -ItemType Directory -Force -Path (Join-Path $repo 'build') | Out-Null
$lockPath = Join-Path $repo 'build\matrix.lock'
$lock = [IO.File]::Open($lockPath, 'OpenOrCreate', 'ReadWrite', 'None')
$transcript = $false

function Checked([string]$Executable, [string[]]$Arguments) {
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Executable failed with exit $LASTEXITCODE" }
}
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
        Checked npm.cmd @('run','build:web')
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
    if ($script:wslReady) {
        Checked python @('scripts/run-command.py','--timeout','45','--','wsl','-d',$WslDistribution,'-u',$WslUser,'--','bash','-n',"$wslRepo/scripts/install-web.sh")
        foreach ($server in @('nginx','apache')) {
            Checked python @('scripts/run-command.py','--timeout','45','--','wsl','-d',$WslDistribution,'-u',$WslUser,'--','bash',"$wslRepo/scripts/install-web.sh",'--dry-run','--server',$server,'--domain','example.test','--destination','/var/www/natally-ai-studio','--package',"$wslRepo/build/$($state.prefix)-web-package")
        }
        $shellEvidence = 'Ubuntu 24.04 Bash'
    } else {
        # This checks generated server configuration, never builds Linux packages.
        $bash = 'E:\DevTools\msys64\usr\bin\bash.exe'
        Checked $bash @('-n',"$($repo.Replace('\','/'))/scripts/install-web.sh")
        foreach ($server in @('nginx','apache')) {
            Checked $bash @("$($repo.Replace('\','/'))/scripts/install-web.sh",'--dry-run','--server',$server,'--domain','example.test','--destination','/var/www/natally-ai-studio','--package',$web.Replace('\','/'))
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
        if ($metadata.ProductVersion -eq $state.version) {
            Stage windows-exe $exe 'win11-x64-standalone.exe' "PE ProductVersion=$($metadata.ProductVersion); unsigned Tauri test, WebView2 required"
        }
    }
    foreach ($bundle in @(@{Target='nsis';Directory='nsis';Extension='exe'},@{Target='msi';Directory='msi';Extension='msi'})) {
        $directory = Join-Path $env:CARGO_TARGET_DIR "release\bundle\$($bundle.Directory)"
        if (Test-Path -LiteralPath $directory) {
            $artifact = Get-ChildItem -LiteralPath $directory -File | Where-Object { $_.Extension -eq ".$($bundle.Extension)" -and $_.Name.Contains($state.version) } | Select-Object -First 1
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
        Stage apk $apk.FullName 'android-arm64-test.apk' "Release profile; local Android test certificate; apksigner and 16 KiB zipalign pass; versionCode=$($state.versionCode)"
    }
    if ($aab) {
        $signature = & (Join-Path $env:JAVA_HOME 'bin\jarsigner.exe') -verify $aab.FullName 2>&1 | Out-String
        if ($LASTEXITCODE -ne 0 -or $signature -notmatch 'jar verified\.') { throw 'AAB JAR signature was not verified' }
        Checked python @('scripts/verify-android-symbols.py','--manifest-only',$aab.FullName,$state.version)
        Stage aab $aab.FullName 'android-arm64-test.aab' "Release profile, local Android test certificate; jarsigner verifies; versionCode=$($state.versionCode)"
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
    Checked wsl @('-d',$WslDistribution,'-u','root','--','bash',"$wslRepo/scripts/setup-linux-build-env.sh")
    Checked wsl @('-d',$WslDistribution,'-u',$WslUser,'--','bash',"$wslRepo/scripts/build-linux.sh")
}

try {
    if (-not $Continue) {
        # Windows checkouts may use CRLF. Normalize shell source before freezing.
        Get-ChildItem -LiteralPath (Join-Path $repo 'scripts') -Filter '*.sh' -File | ForEach-Object {
            $content = [IO.File]::ReadAllText($_.FullName).Replace("`r`n","`n")
            [IO.File]::WriteAllText($_.FullName,$content,(New-Object Text.UTF8Encoding($false)))
        }
        Checked node @('scripts/release-state.mjs','stamp')
    }
    $state = Read-State
    Start-Transcript -LiteralPath (Join-Path $repo "dist\$($state.prefix)-build.log") -Append | Out-Null
    $transcript = $true
    if (-not $Continue) {
        . (Join-Path $repo 'scripts\native-build-env.ps1') -Platform windows -BuildRoot $BuildCache
        if (-not (Test-Path -LiteralPath node_modules)) { Checked npm.cmd @('ci') }
        if (-not (Test-Path -LiteralPath src-tauri/gen/android/app/build.gradle.kts)) { Checked cargo @('tauri','android','init') }
        Checked node @('scripts/configure-android.mjs')
        Checked node @('scripts/release-state.mjs','freeze')
    } else { Checked node @('scripts/release-state.mjs','check') }
    $env:NATALLY_BUILD_VERSION = $state.version
    $env:CARGO_BUILD_JOBS = '4'
    $wslRepo = (& python scripts/run-command.py --timeout 30 -- wsl -d $WslDistribution -u $WslUser -- wslpath -a $repo | Out-String).Trim()
    $script:wslReady = $LASTEXITCODE -eq 0 -and $wslRepo.StartsWith('/mnt/')
    if (-not $script:wslReady) { Write-Warning 'Existing Ubuntu-24.04 did not answer the bounded preflight; collecting native Windows/Android and web results continues.' }
    foreach ($step in @(
        @{Name='Web';Targets=@('web','web-installer');Run={ Build-Web }},
        @{Name='Windows';Targets=@('windows-exe','nsis','msi');Run={ Build-Windows }},
        @{Name='Android';Targets=@('apk','aab','android-symbols');Run={ Build-Android }},
        @{Name='Linux';Targets=@('appimage','deb');Run={ Build-Linux }}
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
} finally {
    if ($transcript) { Stop-Transcript | Out-Null }
    $lock.Dispose()
}
