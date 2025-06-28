# Check existing users in the system

# Login and get token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@money1st.com","password":"admin123"}'
$token = $loginResponse.token
$headers = @{"Authorization" = "Bearer $token"}

Write-Host "📊 Checking existing users in system..." -ForegroundColor Cyan

try {
    $users = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/users?limit=50" -Method GET -Headers $headers
    
    Write-Host "Total users: $($users.pagination.total)" -ForegroundColor Green
    Write-Host "Current users:" -ForegroundColor Yellow
    
    $users.users | ForEach-Object {
        Write-Host "  $($_.firstName) $($_.lastName) ($($_.email)) - $($_.role)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "Error getting users: $($_.Exception.Message)" -ForegroundColor Red
}
