#Requires -Version 5.1
<#
.SYNOPSIS
    One-command local development environment setup for AI Practical Assessment.

.DESCRIPTION
    PowerShell equivalent of scripts/setup.sh.
    Idempotent: safe to run multiple times.

.PARAMETER ForceDbImport
    Re-import database/dump.sql.gz even if Drupal is already installed.

.PARAMETER SkipBrowser
    Do not auto-open the browser after setup.

.EXAMPLE
    .\scripts\setup.ps1
#>

[CmdletBinding()]
param(
    [switch]$ForceDbImport,
    [switch]$SkipBrowser
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Paths and defaults
# ---------------------------------------------------------------------------

$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

$DrupalAdminUser = if ($env:DRUPAL_ADMIN_USER) { $env:DRUPAL_ADMIN_USER } else { "admin" }
$DrupalAdminPass = if ($env:DRUPAL_ADMIN_PASS) { $env:DRUPAL_ADMIN_PASS } else { "admin" }
$DrupalSiteName  = if ($env:DRUPAL_SITE_NAME)  { $env:DRUPAL_SITE_NAME }  else { "AI Practical Assessment" }

$LogDir  = Join-Path $ScriptDir "logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$LogFile = Join-Path $LogDir ("setup-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))

$script:FreshInstall = $false

# ---------------------------------------------------------------------------
# Logging helpers
# ---------------------------------------------------------------------------

function Write-Log {
    param(
        [string]$Level,
        [string]$Message
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] [$Level] $Message"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line
}

function Write-LogInfo    { param([string]$Message) Write-Log "INFO"    $Message }
function Write-LogWarn    { param([string]$Message) Write-Log "WARN"    $Message }
function Write-LogError   { param([string]$Message) Write-Log "ERROR"   $Message }
function Write-LogSuccess { param([string]$Message) Write-Log "SUCCESS" $Message }

function Stop-Setup {
    param([string]$Message)
    Write-LogError $Message
    throw $Message
}

# ---------------------------------------------------------------------------
# State checks
# ---------------------------------------------------------------------------

function Test-CommandExists {
    param([string]$Name)
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Test-DdevRunning {
    try {
        $output = & ddev describe 2>&1 | Out-String
        return $output -match "running"
    }
    catch {
        return $false
    }
}

function Test-DrupalInstalled {
    try {
        $bootstrap = & ddev drush status --fields=bootstrap --format=string 2>&1
        return ($bootstrap -eq "Successful")
    }
    catch {
        return $false
    }
}

function Test-HasConfigSync {
    $files = Get-ChildItem -Path (Join-Path $ProjectRoot "config\sync") -Filter "*.yml" -ErrorAction SilentlyContinue
    return ($files.Count -gt 0)
}

function Test-HasDbDump {
    return (Test-Path (Join-Path $ProjectRoot "database\dump.sql.gz"))
}

function Test-HasNodeModules {
    return (Test-Path (Join-Path $ProjectRoot "src\node_modules"))
}

function Test-HasVendor {
    return (Test-Path (Join-Path $ProjectRoot "vendor\autoload.php"))
}

function Get-DdevUrl {
    try {
        $json = & ddev describe -j 2>&1 | Out-String
        $data = $json | ConvertFrom-Json
        if ($data.raw.primary_url) {
            return $data.raw.primary_url
        }
    }
    catch { }
    return "https://ai-practical-assessment.ddev.site"
}

function Get-ViteUrl {
    $base = Get-DdevUrl
    return "$($base.TrimEnd('/')):5173"
}

# ---------------------------------------------------------------------------
# Step runner
# ---------------------------------------------------------------------------

function Invoke-Step {
    param(
        [string]$Label,
        [scriptblock]$Action
    )
    Write-LogInfo ">>> $Label"
    try {
        & $Action
        Write-LogSuccess ">>> $Label — done"
    }
    catch {
        Stop-Setup ">>> $Label — failed: $_"
    }
}

function Invoke-Ddev {
    param([string[]]$Arguments)
    & ddev @Arguments 2>&1 | Tee-Object -FilePath $LogFile -Append
    if ($LASTEXITCODE -ne 0) {
        throw "ddev $($Arguments -join ' ') failed with exit code $LASTEXITCODE"
    }
}

# ---------------------------------------------------------------------------
# Step implementations
# ---------------------------------------------------------------------------

function Step-Preflight {
    if (-not (Test-CommandExists "ddev"))   { Stop-Setup "Required command 'ddev' not found." }
    if (-not (Test-CommandExists "docker")) { Stop-Setup "Required command 'docker' not found." }
    if (-not (Test-Path (Join-Path $ProjectRoot ".ddev\config.yaml"))) {
        Stop-Setup "Cannot find .ddev\config.yaml. Run from the project root."
    }
    Set-Location $ProjectRoot
    Write-LogInfo "Project root: $ProjectRoot"
}

function Step-StartDdev {
    if (Test-DdevRunning) {
        Write-LogInfo "DDEV is already running — skipping ddev start"
    }
    else {
        Invoke-Ddev @("start")
    }
}

function Step-ComposerInstall {
    if (Test-HasVendor) {
        Write-LogInfo "vendor\ exists — running composer install to sync"
    }
    else {
        Write-LogInfo "vendor\ missing — installing Composer dependencies"
    }
    Invoke-Ddev @("composer", "install", "--no-interaction")
}

function Step-DrupalInstall {
    if (Test-DrupalInstalled) {
        Write-LogInfo "Drupal is already installed — skipping site:install"
        return
    }

    Write-LogInfo "Installing Drupal 11 (standard profile)"
    Invoke-Ddev @(
        "drush", "site:install", "standard",
        "--site-name=$DrupalSiteName",
        "--account-name=$DrupalAdminUser",
        "--account-pass=$DrupalAdminPass",
        "-y"
    )
    $script:FreshInstall = $true
}

function Step-ImportDatabase {
    if (-not (Test-HasDbDump)) {
        Write-LogInfo "No database\dump.sql.gz found — skipping import"
        return
    }

    if (-not $ForceDbImport -and -not $script:FreshInstall) {
        Write-LogInfo "Database dump exists but site is already installed — skipping import"
        Write-LogInfo "Use -ForceDbImport to force re-import"
        return
    }

    Write-LogInfo "Importing database from database\dump.sql.gz"
    $dumpPath = Join-Path $ProjectRoot "database\dump.sql.gz"
    Invoke-Ddev @("import-db", "--file=$dumpPath")
}

function Step-DrupalUpdate {
    Write-LogInfo "Running database updates"
    try {
        Invoke-Ddev @("drush", "updatedb", "-y")
    }
    catch {
        Write-LogWarn "updatedb returned non-zero (may be expected on fresh install)"
    }
}

function Step-ConfigImport {
    if (-not (Test-HasConfigSync)) {
        Write-LogInfo "config\sync is empty — skipping config:import"
        return
    }

    Write-LogInfo "Importing configuration from config\sync"
    try {
        Invoke-Ddev @("drush", "config:import", "-y")
    }
    catch {
        Write-LogWarn "config:import returned non-zero — check config\sync for errors"
    }
}

function Step-EnableCustomModules {
    $customDir = Join-Path $ProjectRoot "web\modules\custom"
    if (-not (Test-Path $customDir)) {
        Write-LogInfo "No custom modules directory — skipping"
        return
    }

    $enabledAny = $false
    Get-ChildItem -Path $customDir -Directory | ForEach-Object {
        $moduleName = $_.Name
        $enabledList = & ddev drush pm:list --status=enabled --format=string 2>&1
        if ($enabledList -match "\b$moduleName\b") {
            Write-LogInfo "Module '$moduleName' already enabled — skipping"
            return
        }

        Write-LogInfo "Enabling custom module: $moduleName"
        try {
            Invoke-Ddev @("drush", "pm:enable", $moduleName, "-y")
            $enabledAny = $true
        }
        catch {
            Write-LogWarn "Could not enable module '$moduleName'"
        }
    }

    if (-not $enabledAny) {
        Write-LogInfo "No new custom modules to enable"
    }
}

function Step-EnsureAdminUser {
    Write-LogInfo "Ensuring Drupal admin account exists"
    $env:DRUPAL_ADMIN_USER = $DrupalAdminUser
    $env:DRUPAL_ADMIN_PASS = $DrupalAdminPass
    Invoke-Ddev @("drush", "php:script", "/var/www/html/scripts/ensure-drupal-admin.php")
}

function Step-CacheClear {
    Write-LogInfo "Clearing Drupal caches"
    Invoke-Ddev @("drush", "cache:rebuild", "-y")
}

function Step-FrontendInstall {
    if (Test-HasNodeModules) {
        Write-LogInfo "src\node_modules exists — syncing dependencies"
    }
    else {
        Write-LogInfo "src\node_modules missing — installing npm dependencies"
    }
    Invoke-Ddev @("exec", "bash /var/www/html/scripts/lib/npm-install.sh")

    $envFile = Join-Path $ProjectRoot "src\.env"
    $envExample = Join-Path $ProjectRoot "src\.env.example"
    if (-not (Test-Path $envFile) -and (Test-Path $envExample)) {
        Copy-Item $envExample $envFile
        Write-LogInfo "Created src\.env from .env.example"
    }
}

function Step-RestartDdev {
    if ($env:RUN_SETUP_NO_RESTART -eq "1") {
        Write-LogInfo "RUN_SETUP_NO_RESTART=1 — skipping ddev restart"
        return
    }
    Write-LogInfo "Restarting DDEV to activate Vite dev server daemon"
    Invoke-Ddev @("restart")
}

function Step-LaunchBrowser {
    if ($SkipBrowser) {
        Write-LogInfo "SkipBrowser set — skipping browser launch"
        return
    }

    $ddevUrl = Get-DdevUrl
    $viteUrl = Get-ViteUrl

    Start-Sleep -Seconds 3

    Write-LogInfo "Opening browser: $ddevUrl"
    try { Invoke-Ddev @("launch") } catch { Start-Process $ddevUrl }

    Write-LogInfo "Opening browser: $viteUrl"
    try { Invoke-Ddev @("launch", ":5173") } catch { Start-Process $viteUrl }
}

function Print-Summary {
    $ddevUrl = Get-DdevUrl
    $viteUrl = Get-ViteUrl

    Write-Host ""
    Write-Host "============================================================"
    Write-Host "  AI Practical Assessment — Setup Complete"
    Write-Host "============================================================"
    Write-Host ""
    Write-Host "  Drupal backend:  $ddevUrl"
    Write-Host "  React frontend:   $viteUrl"
    Write-Host "  Drupal admin:     $ddevUrl/admin"
    Write-Host "  JSON:API:         $ddevUrl/jsonapi"
    Write-Host "  Mailpit:          $ddevUrl`:8025"
    Write-Host ""
    Write-Host "  Admin username:   $DrupalAdminUser"
    Write-Host "  Admin password:   $DrupalAdminPass"
    Write-Host ""
    Write-Host "  Log file:         $LogFile"
    Write-Host "============================================================"
    Write-Host ""
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

Write-LogInfo "=========================================="
Write-LogInfo "AI Practical Assessment — Setup starting"
Write-LogInfo "=========================================="

$ensureHooks = Join-Path $ScriptDir "ensure-git-hooks.sh"
if (Test-Path $ensureHooks) {
    & bash $ensureHooks 2>$null
}

Invoke-Step "Preflight checks"           { Step-Preflight }
Invoke-Step "Start DDEV"                 { Step-StartDdev }
Invoke-Step "Composer install"           { Step-ComposerInstall }
Invoke-Step "Drupal install"             { Step-DrupalInstall }
Invoke-Step "Import database"            { Step-ImportDatabase }
Invoke-Step "Enable custom modules"      { Step-EnableCustomModules }
Invoke-Step "Ensure admin user"          { Step-EnsureAdminUser }
Invoke-Step "Database updates"           { Step-DrupalUpdate }
Invoke-Step "Config import"              { Step-ConfigImport }
Invoke-Step "Clear caches"               { Step-CacheClear }
Invoke-Step "Frontend npm install"       { Step-FrontendInstall }
Invoke-Step "Restart DDEV (Vite daemon)" { Step-RestartDdev }

Print-Summary

Invoke-Step "Launch browser"             { Step-LaunchBrowser }

$localDir = Join-Path $ProjectRoot ".local"
New-Item -ItemType Directory -Force -Path $localDir | Out-Null
Set-Content -Path (Join-Path $localDir "setup-complete") -Value (Get-Date -Format "o")

Write-LogSuccess "Setup completed successfully."
