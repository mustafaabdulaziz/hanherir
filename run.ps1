# Khan Al Harir — siteyi ve yönetim panelini başlatır.
# Kullanım: PowerShell'de proje klasöründe  .\run.ps1
# İlk çalıştırmada bağımlılıkları kurar ve arayüzü derler.

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

$pythonCmd = if (Get-Command py -ErrorAction SilentlyContinue) { "py" }
             elseif (Test-Path "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe") { "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" }
             elseif (Get-Command python -ErrorAction SilentlyContinue) { "python" }
             else { "python" }

Write-Host "Python paketleri kontrol ediliyor..." -ForegroundColor DarkGray
& $pythonCmd -m pip install -r backend\requirements.txt --quiet --disable-pip-version-check

if (-not (Test-Path "frontend\node_modules")) {
  Write-Host "npm paketleri kuruluyor (ilk sefer)..." -ForegroundColor DarkGray
  Push-Location frontend; cmd.exe /c npm install --no-audit --no-fund; Pop-Location
}

if (-not (Test-Path "frontend\dist\index.html") -or $args -contains "--build") {
  Write-Host "Arayüz derleniyor..." -ForegroundColor DarkGray
  Push-Location frontend; cmd.exe /c npm run build; Pop-Location
}

Write-Host ""
Write-Host "Site:          http://127.0.0.1:5000/" -ForegroundColor Green
Write-Host "Yönetim paneli: http://127.0.0.1:5000/admin  (ilk şifre: admin123)" -ForegroundColor Green
Write-Host "Durdurmak için Ctrl+C" -ForegroundColor DarkGray
Write-Host ""

Set-Location backend
& $pythonCmd app.py

