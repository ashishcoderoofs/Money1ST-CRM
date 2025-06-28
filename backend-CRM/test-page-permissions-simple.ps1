# Test Page Permissions Functionality

Write-Host "🚀 Testing Page Permissions System..." -ForegroundColor Green

# Login and get token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@money1st.com","password":"admin123"}'
$token = $loginResponse.token
$headers = @{"Authorization" = "Bearer $token"}

Write-Host "Token acquired: $($token.Substring(0,20))..." -ForegroundColor Cyan

# 1. Initialize default page permissions
Write-Host ""
Write-Host "1. Initializing default page permissions..." -ForegroundColor Yellow
try {
    $initResult = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/page-permissions/initialize" -Method POST -Headers $headers
    Write-Host "   ✅ Initialized: $($initResult.data.created) created, $($initResult.data.updated) updated" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to initialize: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Get all page permissions
Write-Host ""
Write-Host "2. Getting all page permissions..." -ForegroundColor Yellow
try {
    $permissions = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/page-permissions" -Method GET -Headers $headers
    Write-Host "   ✅ Retrieved $($permissions.data.Count) page permissions" -ForegroundColor Green
    
    Write-Host "   📋 Current Page Permissions:" -ForegroundColor Cyan
    $permissions.data | ForEach-Object {
        Write-Host "     • $($_.pageName): Admin=$($_.rolePermissions.Admin), FB=$($_.rolePermissions.'Field Builder')" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Failed to get permissions: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test toggling a permission
Write-Host ""
Write-Host "3. Testing permission toggle..." -ForegroundColor Yellow
try {
    $toggleBody = '{"role":"Field Trainer"}'
    $toggleResult = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/page-permissions/Securia/toggle" -Method PATCH -Headers $headers -ContentType "application/json" -Body $toggleBody
    Write-Host "   ✅ Toggled: $($toggleResult.message)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to toggle permission: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test getting user page permissions
Write-Host ""
Write-Host "4. Getting current user's page permissions..." -ForegroundColor Yellow
try {
    $userPermissions = Invoke-RestMethod -Uri "http://localhost:3000/api/users/page-permissions" -Method GET -Headers $headers
    Write-Host "   ✅ Retrieved permissions for role: $($userPermissions.data.role)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to get user permissions: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Page Permissions testing completed!" -ForegroundColor Green
