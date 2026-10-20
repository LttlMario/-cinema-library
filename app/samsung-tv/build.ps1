param(
  [string]$TizenStudio = 'D:\tizen-studio'
)

$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $MyInvocation.MyCommand.Path
$tizen = Join-Path $TizenStudio 'tools\ide\bin\tizen.bat'
$dist = Join-Path $project 'dist'
$packageOut = Join-Path (Split-Path -Parent $project) 'samsung-tv-package'
$packageSource = Join-Path (Split-Path -Parent $project) 'samsung-tv-source'

if (-not (Test-Path -LiteralPath $tizen)) {
  throw "Tizen CLI nu a fost găsit la $tizen. Instalează Tizen Studio sau transmite calea cu -TizenStudio."
}

if (Test-Path -LiteralPath $packageOut) {
  Remove-Item -LiteralPath $packageOut -Recurse -Force
}
if (Test-Path -LiteralPath $packageSource) {
  Remove-Item -LiteralPath $packageSource -Recurse -Force
}
if (Test-Path -LiteralPath $dist) {
  Remove-Item -LiteralPath $dist -Recurse -Force
}
New-Item -ItemType Directory -Path $dist -Force | Out-Null
New-Item -ItemType Directory -Path $packageSource -Force | Out-Null
foreach ($file in @('config.xml', 'index.html', 'providers.json', 'icon.png')) {
  Copy-Item -LiteralPath (Join-Path $project $file) -Destination $packageSource
}
Copy-Item -LiteralPath (Join-Path $project 'assets') -Destination $packageSource -Recurse
Push-Location $packageSource
try {
  # Keep the output outside the project so a previous WGT cannot be packaged
  # inside the next WGT as an unsigned nested file.
  & $tizen package -t wgt -o $packageOut -- .
  if ($LASTEXITCODE -ne 0) { throw "Tizen CLI a eșuat cu codul $LASTEXITCODE." }
  $generated = Join-Path $packageOut 'Cinema Library.wgt'
  $deployPackage = Join-Path $dist 'CinemaTV01.wgt'
  if (Test-Path -LiteralPath $generated) {
    Copy-Item -LiteralPath $generated -Destination $deployPackage -Force
  }
  Write-Host "Pachetul Samsung TV a fost generat în $deployPackage"
} finally {
  Pop-Location
}

