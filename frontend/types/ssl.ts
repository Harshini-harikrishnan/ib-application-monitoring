// TypeScript interfaces for SSL monitoring

export interface Site {
    id: number;
    name: string;
    url: string;
    siteId: string;
    isActive: boolean;
    createdDate: string;
    lastChecked?: string;
    status: 'up' | 'down' | 'maintenance' | 'unknown';
    sslCertificate?: SSLCertificate;
  }
  
  export interface SSLCertificate {
    id: number;
    domain: string;
    sslId: string;
    expiryDate?: string;
    issueDate?: string;
    issuer?: string;
    status: 'valid' | 'expiring' | 'critical' | 'expired' | 'invalid' | 'error';
    daysRemaining: number;
    alertsSent: boolean;
    lastAlertSent?: string;
    lastChecked: string;
    siteName?: string;
    siteUrl?: string;
  }
  
  export interface SSLSummary {
    totalCertificates: number;
    validCertificates: number;
    expiringCertificates: number;
    criticalCertificates: number;
    expiredCertificates: number;
  }
  
  export interface SSLCheckResult {
    isValid: boolean;
    daysRemaining: number;
    status: string;
    errorMessage?: string;
    responseTimeMs: number;
    certExpiryDate?: string;
    certIssueDate?: string;
    certIssuer?: string;
    certSubject?: string;
  }
  
  export interface CreateSiteRequest {
    name: string;
    url: string;
  }
  
  export interface UpdateSiteRequest {
    name: string;
    url: string;
    isActive: boolean;
  }
  
  export interface SSLCheckRequest {
    siteId: number;
  }
  
  export interface SSLBulkCheckRequest {
    siteIds: number[];
  }