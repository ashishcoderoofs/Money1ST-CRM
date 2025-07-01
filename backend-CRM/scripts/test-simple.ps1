# Simple Page Permissions Test

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@money1st.com","password":"admin123"}'
$token = $loginResponse.token
$headers = @{"Authorization" = "Bearer $token"}

Write-Host "Testing Page Permissions..." -ForegroundColor Green

# Initialize default pages
try {
    $initResult = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/page-permissions/initialize" -Method POST -Headers $headers
    Write-Host "✅ Initialized pages: $($initResult.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Init failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Get page permissions  
try {
    $permissions = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/page-permissions" -Method GET -Headers $headers
    Write-Host "✅ Got $($permissions.data.Count) page permissions" -ForegroundColor Green
} catch {
    Write-Host "❌ Get failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test toggle
try {
    $toggleBody = '{"role":"Field Trainer"}'
    $toggleResult = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/page-permissions/Securia/toggle" -Method PATCH -Headers $headers -ContentType "application/json" -Body $toggleBody
    Write-Host "✅ Toggle successful: $($toggleResult.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Toggle failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Test completed!" -ForegroundColor Cyan
