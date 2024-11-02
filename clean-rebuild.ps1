# Set strict mode and error handling
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Store original location
$originalLocation = Get-Location

# Suppress Node.js experimental warnings
$env:NODE_NO_WARNINGS = 1

# Function to remove directory with retry logic
function Remove-DirectoryWithRetry {
    param (
        [string]$Path,
        [string]$Description,
        [int]$MaxAttempts = 3,
        [int]$RetryDelaySeconds = 2
    )
    
    if (Test-Path $Path) {
        Write-Host "Removing $Description..." -ForegroundColor Yellow
        $attempt = 1
        
        while ($attempt -le $MaxAttempts) {
            try {
                Remove-Item -Recurse -Force $Path -ErrorAction Stop
                break
            }
            catch {
                if ($attempt -eq $MaxAttempts) {
                    Write-Host "Failed to remove $Description after $MaxAttempts attempts. Error: $_" -ForegroundColor Red
                    throw
                }
                Write-Host "Attempt $attempt failed, waiting $RetryDelaySeconds seconds before retry..." -ForegroundColor Yellow
                Start-Sleep -Seconds $RetryDelaySeconds
                $attempt++
            }
        }
    }
}

# Function to check and stop running processes
function Stop-ProjectProcesses {
    $processNames = @("node", "npm", "cargo")
    foreach ($processName in $processNames) {
        $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
        if ($processes) {
            Write-Host "Stopping $processName processes..." -ForegroundColor Yellow
            $processes | Stop-Process -Force
            Start-Sleep -Seconds 2
        }
    }
}

# Function to safely check for Tauri CLI
function Test-TauriCLI {
    param (
        [string]$Version
    )
    
    try {
        $npmList = npm list @tauri-apps/cli --depth=0 2>$null
        return $npmList -like "*@tauri-apps/cli@$Version*"
    }
    catch {
        return $false
    }
}

try {
    Write-Host "Starting clean rebuild process..." -ForegroundColor Cyan
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
    
    # Stop any running processes that might lock files
    Stop-ProjectProcesses
    
    # Clear various caches and temp files
    $cleanupPaths = @(
        @{Path = "node_modules"; Desc = "node_modules directory"},
        @{Path = "src-tauri/target"; Desc = "Rust target directory"},
        @{Path = "dist"; Desc = "dist directory"},
        @{Path = ".parcel-cache"; Desc = "Parcel cache"},
        @{Path = ".turbo"; Desc = "Turbo cache"},
        @{Path = ".next"; Desc = "Next.js cache"},
        @{Path = ".vite"; Desc = "Vite cache"},
        @{Path = "target"; Desc = "Root target directory"}
    )
    
    foreach ($cleanup in $cleanupPaths) {
        Remove-DirectoryWithRetry -Path $cleanup.Path -Description $cleanup.Desc
    }
    
    # Remove lock files and generated files
    $filesToRemove = @(
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",
        ".eslintcache",
        ".tsbuildinfo",
        "tsconfig.tsbuildinfo"
    )
    
    foreach ($file in $filesToRemove) {
        if (Test-Path $file) {
            Write-Host "Removing $file..." -ForegroundColor Yellow
            Remove-Item -Force $file
        }
    }
    
    # Clean various caches
    Write-Host "Cleaning development caches..." -ForegroundColor Yellow
    
    # Clean npm cache
    Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
    npm cache clean --force
    npm cache verify
    
    # Find and clean Cargo project
    $cargoToml = Get-ChildItem -Path . -Filter "Cargo.toml" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($cargoToml) {
        Write-Host "Found Cargo.toml in: $($cargoToml.Directory)" -ForegroundColor Yellow
        Push-Location $cargoToml.Directory
        Write-Host "Cleaning Cargo cache..." -ForegroundColor Yellow
        cargo clean
        Pop-Location
    }
    
    # Reinstall dependencies
    Write-Host "Installing dependencies..." -ForegroundColor Green
    npm install
    
    # Verify Tauri CLI installation
    Write-Host "Verifying Tauri CLI..." -ForegroundColor Cyan
    $tauriVersion = "1.5.9"
    if (-not (Test-TauriCLI -Version $tauriVersion)) {
        Write-Host "Installing Tauri CLI v$tauriVersion..." -ForegroundColor Yellow
        npm install -D "@tauri-apps/cli@^$tauriVersion"
    }
    
    # Run type checking
    Write-Host "Running TypeScript type check..." -ForegroundColor Cyan
    npm run type-check
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Clean rebuild completed successfully!" -ForegroundColor Green
        Write-Host "You can now run 'npm run tauri dev' to start the development server." -ForegroundColor Cyan
    } else {
        throw "TypeScript type check failed"
    }
} catch {
    Write-Host "Error during clean rebuild: $_" -ForegroundColor Red
    Write-Host "Stack trace: $($_.ScriptStackTrace)" -ForegroundColor DarkGray
    exit 1
} finally {
    # Restore working directory if changed during script execution
    Set-Location $originalLocation
    
    # Reset Node warnings setting
    $env:NODE_NO_WARNINGS = 0
}