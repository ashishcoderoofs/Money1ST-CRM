# Test single user creation with automatic entryDate

# Login and get token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@money1st.com","password":"admin123"}'
$token = $loginResponse.token
$headers = @{"Authorization" = "Bearer $token"}

Write-Host "🚀 Testing user creation with automatic entryDate..." -ForegroundColor Green
Write-Host "Token acquired: $($token.Substring(0,20))..." -ForegroundColor Cyan

# Test user data (without entryDate)
$userBody = @{
    consultantId = "TEST999"
    firstName = "Test"
    lastName = "User"
    email = "test999@example.com"
    password = "password123"
    role = "IBA"
}
$userJson = $userBody | ConvertTo-Json

try {
    Write-Host "Creating test user..." -ForegroundColor Yellow
    
    $result = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/users" -Method POST -Headers $headers -ContentType "application/json" -Body $userJson
    
    Write-Host "✅ User created successfully!" -ForegroundColor Green
    Write-Host "  ID: $($result.user._id)" -ForegroundColor Cyan
    Write-Host "  Email: $($result.user.email)" -ForegroundColor Cyan
    Write-Host "  Entry Date: $($result.user.entryDate)" -ForegroundColor Cyan
    Write-Host "  Role: $($result.user.role)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Failed to create user" -ForegroundColor Red
    
    # Try to get error details
    $errorDetails = ""
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            $reader.Close()
            
            $errorJson = $errorBody | ConvertFrom-Json
            $errorDetails = $errorJson.error
        } catch {
            $errorDetails = $errorBody
        }
    } else {
        $errorDetails = $_.Exception.Message
    }
    
    Write-Host "Error details: $errorDetails" -ForegroundColor Red
}

Write-Host "🎉 Test completed!" -ForegroundColor Green
