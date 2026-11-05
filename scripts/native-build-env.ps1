# Dot-source before native Windows or Android builds. Large tools, caches and
# compilation output live on E:. This does not install a Tauri shell in Natally.
param(
    [ValidateSet('windows', 'android')]
    [string]$Platform = 'windows',
    [string]$BuildRoot = 'E:\DevTools\natally',
    [string]$SharedToolchain = 'E:\DevTools\pearl-build-env.ps1'
)

if (-not (Test-Path -LiteralPath $SharedToolchain -PathType Leaf)) {
    throw "Shared toolchain was not found: $SharedToolchain"
}
. $SharedToolchain

$env:NDK_HOME = $env:ANDROID_NDK_HOME
$env:CARGO_TARGET_DIR = Join-Path $BuildRoot "targets\$Platform"
New-Item -ItemType Directory -Force -Path $env:CARGO_TARGET_DIR -ErrorAction Stop | Out-Null

foreach ($toolDirectory in @($env:CARGO_HOME, $env:RUSTUP_HOME, $env:JAVA_HOME, $env:ANDROID_HOME, $env:NDK_HOME)) {
    if (-not (Test-Path -LiteralPath $toolDirectory -PathType Container)) {
        throw "Required toolchain directory was not found: $toolDirectory"
    }
}
Write-Output "Natally $Platform build output: $env:CARGO_TARGET_DIR"
