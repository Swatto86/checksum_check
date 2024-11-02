# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "Cleaning project..." -ForegroundColor Cyan

# Remove node_modules
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
}

# Remove Rust target directory
if (Test-Path "src-tauri/target") {
    Write-Host "Removing Rust target directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "src-tauri/target"
}

# Remove dist directory
if (Test-Path "dist") {
    Write-Host "Removing dist directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "dist"
}

# Remove package-lock.json
if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force "package-lock.json"
}

# Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

# Verify Tauri CLI installation
Write-Host "Verifying Tauri CLI..." -ForegroundColor Cyan
npm list @tauri-apps/cli
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing Tauri CLI..." -ForegroundColor Yellow
    npm install -D @tauri-apps/cli@^1.5.9
}

# Run type checking
Write-Host "Running TypeScript type check..." -ForegroundColor Cyan
npm run type-check

if ($LASTEXITCODE -eq 0) {
    Write-Host "Clean rebuild completed successfully!" -ForegroundColor Green
    Write-Host "You can now run 'npm run tauri dev' to start the development server." -ForegroundColor Cyan
} else {
    Write-Host "Build failed - please check the errors above." -ForegroundColor Red
    exit 1
}