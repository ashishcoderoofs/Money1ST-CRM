# Verify User Creation Results

# Login and get token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@money1st.com","password":"admin123"}'
$token = $loginResponse.token
$headers = @{"Authorization" = "Bearer $token"}

Write-Host "🔍 VERIFICATION: User Creation Results" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Get all users
$allUsers = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/users?limit=50" -Method GET -Headers $headers

# Get dashboard stats
$stats = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/dashboard/stats" -Method GET -Headers $headers

Write-Host ""
Write-Host "📊 SYSTEM STATISTICS:" -ForegroundColor Green
Write-Host "Total Users: $($stats.stats.totalUsers)" -ForegroundColor Cyan
Write-Host "Active Users: $($stats.stats.activeUsers)" -ForegroundColor Green  
Write-Host "Inactive Users: $($stats.stats.inactiveUsers)" -ForegroundColor Yellow

Write-Host ""
Write-Host "👥 ROLE DISTRIBUTION:" -ForegroundColor Green
$stats.stats.roleDistribution | ForEach-Object { 
    Write-Host "  $($_._id): $($_.count)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📋 ALL CREATED USERS:" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host "ConsultID`t`tName`t`t`tEmail`t`t`t`tRole`t`t`tStatus" -ForegroundColor Yellow

$allUsers.users | Sort-Object consultantId | ForEach-Object {
    $name = "$($_.firstName) $($_.lastName)"
    $status = if ($_.status -eq "Active") { "✅ Active" } else { "⚪ Inactive" }
    Write-Host "$($_.consultantId)`t`t$($name.PadRight(20))`t$($_.email.PadRight(30))`t$($_.role.PadRight(15))`t$status"
}

Write-Host ""
Write-Host "User creation verification completed!" -ForegroundColor Green
