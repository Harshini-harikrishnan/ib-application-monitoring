# SSL Expiry Backend Implementation Structure

## Project Structure

```
WebMonitorAPI/
├── Controllers/
│   ├── AuthController.cs (existing)
│   ├── SitesController.cs (new)
│   └── SSLController.cs (new)
├── Models/
│   ├── User.cs (existing)
│   ├── Site.cs (new)
│   ├── SSLCertificate.cs (new)
│   └── SSLCheckResult.cs (new)
├── Services/
│   ├── IEmailService.cs (existing)
│   ├── EmailService.cs (existing)
│   ├── ISSLService.cs (new)
│   ├── SSLService.cs (new)
│   ├── ISSLMonitoringService.cs (new)
│   └── SSLMonitoringService.cs (new)
├── DTOs/
│   ├── AuthDtos.cs (existing)
│   ├── SiteDto.cs (new)
│   └── SSLDto.cs (new)
├── Data/
│   ├── ApplicationDbContext.cs (existing - updated)
│   └── Migrations/ (auto-generated)
├── BackgroundServices/
│   └── SSLMonitoringBackgroundService.cs (new)
└── Helpers/
    └── SSLHelper.cs (new)
```

## Files to Create/Modify

### 1. Models (4 files)
- **Site.cs**: Store website information
- **SSLCertificate.cs**: Store SSL certificate data
- **SSLCheckResult.cs**: Store SSL check results
- **ApplicationDbContext.cs**: Update with new DbSets

### 2. Services (4 files)
- **ISSLService.cs**: Interface for SSL operations
- **SSLService.cs**: Core SSL checking logic
- **ISSLMonitoringService.cs**: Interface for monitoring service
- **SSLMonitoringService.cs**: Business logic for SSL monitoring

### 3. Controllers (2 files)
- **SitesController.cs**: Manage sites CRUD operations
- **SSLController.cs**: Handle SSL-related API endpoints

### 4. DTOs (2 files)
- **SiteDto.cs**: Data transfer objects for sites
- **SSLDto.cs**: Data transfer objects for SSL data

### 5. Background Services (1 file)
- **SSLMonitoringBackgroundService.cs**: Automated SSL checking

### 6. Helpers (1 file)
- **SSLHelper.cs**: Utility functions for SSL operations

### 7. Frontend Updates (3 files)
- **components/monitoring/SSLExpiry.tsx**: Update with real data
- **lib/api.ts**: API service functions
- **types/ssl.ts**: TypeScript interfaces

## Total: 14 new files + 2 updated files
