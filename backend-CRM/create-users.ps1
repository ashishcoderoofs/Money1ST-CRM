# Money1st CRM - Bulk User Creation Script

# Login and get token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@money1st.com","password":"admin123"}'
$token = $loginResponse.token
$headers = @{"Authorization" = "Bearer $token"}

Write-Host "🚀 Starting bulk user creation..." -ForegroundColor Green
Write-Host "Token acquired: $($token.Substring(0,20))..." -ForegroundColor Cyan

# Define all users to create
$users = @(
    @{consultantId="06068dca"; firstName="Ashish"; lastName="Mittal"; email="crsfb2@gmail.com"; role="Field Builder"; entryDate="2025-06-20"; makeInactive=$true},
    @{consultantId="a9cc5eb1"; firstName="Ashish"; lastName="Mittal"; email="crsft4@gmail.com"; role="Field Trainer"; entryDate="2025-06-20"},
    @{consultantId="da7a314e"; firstName="Ashish"; lastName="Mittal"; email="crssrbma1@gmail.com"; role="Sr. BMA"; entryDate="2025-06-20"},
    @{consultantId="0f1b8567"; firstName="Coderoofs"; lastName="Shaw"; email="crsft2@gmail.com"; role="Field Trainer"; entryDate="2025-06-20"},
    @{consultantId="adc98801"; firstName="Ashish"; lastName="Mittal"; email="crsft1@gmail.com"; role="Field Trainer"; entryDate="2025-06-20"},
    @{consultantId="3bfde01b"; firstName="Ashish"; lastName="Mittal"; email="crsfb@gmail.com"; role="Field Builder"; entryDate="2025-06-20"},
    @{consultantId="e91edfcb"; firstName="crsft"; lastName="crsft"; email="crsft@gmail.com"; role="Field Trainer"; entryDate="2025-06-20"},
    @{consultantId="0fa5da22"; firstName="crssrbma"; lastName="test"; email="crssrbma@gmail.com"; role="Sr. BMA"; entryDate="2025-06-20"},
    @{consultantId="b6ba68a8"; firstName="crsbma"; lastName="bma"; email="crsbma@gmail.com"; role="BMA"; entryDate="2025-06-20"},
    @{consultantId="344b21bc"; firstName="crs"; lastName="crs"; email="crstest1@gmail.com"; role="IBA"; entryDate="2025-06-20"},
    @{consultantId="0e92d484"; firstName="CRS"; lastName="TI"; email="crstest@gmail.com"; role="IBA"; entryDate="2025-06-20"},
    @{consultantId="1529f30c"; firstName="Coderoofs"; lastName="IT"; email="coderoofitsolutions@gmail.com"; role="IBA"; entryDate="2025-06-20"},
    @{consultantId="68c3fbb4"; firstName="Ashish"; lastName="Mittal"; email="ashish@coderoofs.com"; role="Sr. BMA"; entryDate="2025-06-19"},
    @{consultantId="c0ed4651"; firstName="Ashish"; lastName="Mittal"; email="mittal.30ashish@gmail.com"; role="Field Builder"; entryDate="2025-06-19"},
    @{consultantId="724dbfea"; firstName="Karen"; lastName="Shaw"; email="test2@example.com"; role="IBA"; entryDate="2025-06-18"},
    @{consultantId="92887bbe"; firstName="Tracy"; lastName="Morgan"; email="test@example.com"; role="IBA"; entryDate="2025-06-18"},
    @{consultantId="b9f09833"; firstName="Admin"; lastName="User"; email="admin@securia.com"; role="Admin"; entryDate="2025-06-18"},
    @{consultantId="efad2f74"; firstName="Jazzy"; lastName="Jeff"; email="jazzyj.m1f@gmail.com"; role="Sr. BMA"; entryDate="2025-06-18"},
    @{consultantId="09d91e9c"; firstName="Luther"; lastName="Vandross"; email="testtest@gmail.com"; role="IBA"; entryDate="2025-06-18"},
    @{consultantId="316d6cb4"; firstName="Jim"; lastName="Brown"; email="jimb.m1f@gmail.com"; role="BMA"; entryDate="2025-06-18"},
    @{consultantId="f24112f0"; firstName="Petey"; lastName="Pablo"; email="peteyp.m1f@gmail.com"; role="IBA"; entryDate="2025-06-17"},
    @{consultantId="cf023b75"; firstName="Jamie"; lastName="Lawson"; email="testuser@gmail.com"; role="Admin"; entryDate="2025-06-17"},
    @{consultantId="845103b3"; firstName="Martie"; lastName="Mclean"; email="martiem.m1f@gmail.com"; role="Admin"; entryDate="2025-06-15"}
)

$successCount = 0
$errorCount = 0

# Create each user
foreach ($userData in $users) {
    $userBody = @{
        consultantId = $userData.consultantId
        entryDate = $userData.entryDate
        firstName = $userData.firstName
        lastName = $userData.lastName
        email = $userData.email
        password = "password123"
        role = $userData.role
    }
    $userJson = $userBody | ConvertTo-Json
    
    try {
        Write-Host "Creating: $($userData.firstName) $($userData.lastName) ($($userData.email)) - $($userData.role)" -ForegroundColor Yellow
        
        $result = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/users" -Method POST -Headers $headers -ContentType "application/json" -Body $userJson
        
        Write-Host "  ✅ Created successfully with ID: $($result.user._id)" -ForegroundColor Green
        $successCount++
        
        # If user should be inactive, toggle status
        if ($userData.makeInactive) {
            $toggleResult = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/users/$($result.user._id)/toggle-status" -Method PATCH -Headers $headers
            Write-Host "  ⚪ Status set to Inactive" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
    
    # Small delay to avoid overwhelming the server
    Start-Sleep -Milliseconds 100
}

Write-Host "`n📊 Creation Summary:" -ForegroundColor Cyan
Write-Host "✅ Successfully created: $successCount users" -ForegroundColor Green
Write-Host "❌ Failed: $errorCount users" -ForegroundColor Red

# Get final user count
Write-Host "`n📈 Final Statistics:" -ForegroundColor Cyan
$finalUsers = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/users?limit=100" -Method GET -Headers $headers
Write-Host "Total users in system: $($finalUsers.pagination.total)" -ForegroundColor Cyan

# Show role distribution
$roleStats = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/dashboard/stats" -Method GET -Headers $headers
Write-Host "`n👥 Role Distribution:" -ForegroundColor Cyan
$roleStats.stats.roleDistribution | ForEach-Object {
    Write-Host "  $($_._id): $($_.count)" -ForegroundColor Gray
}

Write-Host "`n🎉 Bulk user creation completed!" -ForegroundColor Green
