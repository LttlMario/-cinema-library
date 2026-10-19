param(
  [string]$TizenStudio = 'D:\tizen-studio'
)

$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $MyInvocation.MyCommand.Path
$tizen = Join-Path $TizenStudio 'tools\ide\bin\tizen.bat'
$dist = Join-Path $project 'dist'

if (-not (Test-Path -LiteralPath $tizen)) {
  throw "Tizen CLI nu a fost găsit la $tizen. Instalează Tizen Studio sau transmite calea cu -TizenStudio."
}

New-Item -ItemType Directory -Path $dist -Force | Out-Null
Push-Location $project
try {
  & $tizen package -t wgt -o $dist -- .
  if ($LASTEXITCODE -ne 0) { throw "Tizen CLI a eșuat cu codul $LASTEXITCODE." }
  $generated = Join-Path $dist 'Cinema Library.wgt'
  $deployPackage = Join-Path $dist 'CinemaTV01.wgt'
  if (Test-Path -LiteralPath $generated) {
    Copy-Item -LiteralPath $generated -Destination $deployPackage -Force
  }
  Write-Host "Pachetul Samsung TV a fost generat în $deployPackage"
} finally {
  Pop-Location
}
