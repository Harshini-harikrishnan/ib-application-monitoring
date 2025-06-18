# SSL Expiry Backend Setup Instructions

## Step-by-Step Implementation Guide

### 1. Prerequisites
- .NET 8.0 SDK installed
- Oracle Database (Free tier available)
- Visual Studio or VS Code
- Existing WebMonitor API project

### 2. Install Required NuGet Packages

```bash
# Navigate to your WebMonitor API project
cd WebMonitorAPI

# Install additional packages for SSL monitoring
dotnet add package System.Net.Security
dotnet add package System.Security.Cryptography.X509Certificates
```

### 3. Database Migration

```bash
# Add migration for new SSL models
dotnet ef migrations add AddSSLMonitoring

# Update database
dotnet ef database update
```

### 4. Update appsettings.json

Add email configuration for SSL alerts:

```json
{
  "Email": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "Username": "your-email@gmail.com",
    "Password": "your-app-password",
    "From": "noreply@webmonitor.com"
  }
}
```

### 5. Test SSL Service

Create a test endpoint to verify SSL checking works:

```csharp
[HttpGet("test-ssl/{domain}")]
public async Task<ActionResult> TestSSL(string domain)
{
    var result = await _sslService.CheckSSLCertificateAsync(domain);
    return Ok(result);
}
```

### 6. Run the Application

```bash
# Start the backend
dotnet run

# The background service will automatically start checking SSL certificates every 6 hours
```

### 7. Frontend Integration

Update your Next.js environment variables:

```env
NEXT_PUBLIC_API_URL=https://localhost:7001/api
```

### 8. Testing the Implementation

1. **Add a site** through the Manage Sites page
2. **Check SSL** by clicking the shield icon
3. **View SSL status** in the SSL Expiry page
4. **Test alerts** by manually triggering them

### 9. Production Considerations

- Set up proper email SMTP credentials
- Configure SSL certificate validation for production
- Set up monitoring for the background service
- Implement rate limiting for SSL checks
- Add logging and error handling

### 10. API Endpoints Available

- `GET /api/sites` - Get all sites
- `POST /api/sites` - Create new site
- `GET /api/ssl` - Get all SSL certificates
- `GET /api/ssl/expiring` - Get expiring certificates
- `POST /api/ssl/check` - Check specific SSL certificate
- `POST /api/ssl/check-all` - Check all SSL certificates
- `GET /api/ssl/summary` - Get SSL summary statistics

### 11. Background Service Features

- Runs every 6 hours automatically
- Sends email alerts for expiring certificates
- Updates SSL certificate status
- Logs all activities

### 12. Error Handling

The system handles:
- Invalid domains
- Network timeouts
- SSL certificate errors
- Database connection issues
- Email sending failures

All errors are logged and don't crash the application.