using Microsoft.EntityFrameworkCore;
using WebMonitorAPI.Data;
using WebMonitorAPI.Models;
using WebMonitorAPI.DTOs;
using WebMonitorAPI.Services;

namespace WebMonitorAPI.Services
{
    public class SSLMonitoringService : ISSLMonitoringService
    {
        private readonly ApplicationDbContext _context;
        private readonly ISSLService _sslService;
        private readonly IEmailService _emailService;
        private readonly ILogger<SSLMonitoringService> _logger;

        public SSLMonitoringService(
            ApplicationDbContext context,
            ISSLService sslService,
            IEmailService emailService,
            ILogger<SSLMonitoringService> logger)
        {
            _context = context;
            _sslService = sslService;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<List<SSLCertificateDto>> GetAllSSLCertificatesAsync(string userId)
        {
            var certificates = await _context.SSLCertificates
                .Include(s => s.Site)
                .Where(s => s.Site.UserId == userId)
                .OrderBy(s => s.DaysRemaining)
                .ToListAsync();

            return certificates.Select(MapToDto).ToList();
        }

        public async Task<List<SSLCertificateDto>> GetExpiringCertificatesAsync(string userId, int daysThreshold = 30)
        {
            var certificates = await _context.SSLCertificates
                .Include(s => s.Site)
                .Where(s => s.Site.UserId == userId && s.DaysRemaining <= daysThreshold)
                .OrderBy(s => s.DaysRemaining)
                .ToListAsync();

            return certificates.Select(MapToDto).ToList();
        }

        public async Task<SSLCertificateDto> GetSSLCertificateByIdAsync(int id, string userId)
        {
            var certificate = await _context.SSLCertificates
                .Include(s => s.Site)
                .FirstOrDefaultAsync(s => s.Id == id && s.Site.UserId == userId);

            return certificate != null ? MapToDto(certificate) : null;
        }

        public async Task<bool> UpdateSSLCertificateAsync(int siteId, string userId)
        {
            try
            {
                _logger.LogInformation("Starting SSL certificate update for site {SiteId}, user {UserId}", siteId, userId);

                var site = await _context.Sites
                    .Include(s => s.SSLCertificates)
                    .FirstOrDefaultAsync(s => s.Id == siteId && s.UserId == userId);

                if (site == null)
                {
                    _logger.LogWarning("Site not found: {SiteId} for user {UserId}", siteId, userId);
                    return false;
                }

                _logger.LogInformation("Found site: {SiteName} ({SiteUrl})", site.Name, site.Url);

                var checkResult = await _sslService.CheckSSLCertificateAsync(site);
                _logger.LogInformation("SSL check result for {SiteUrl}: Valid={IsValid}, Status={Status}, Days={Days}", 
                    site.Url, checkResult.IsValid, checkResult.Status, checkResult.DaysRemaining);

                // Update or create SSL certificate record
                var sslCert = site.SSLCertificates.FirstOrDefault();
                if (sslCert == null)
                {
                    _logger.LogInformation("Creating new SSL certificate record for site {SiteId}", siteId);
                    sslCert = new SSLCertificate
                    {
                        Domain = ExtractDomain(site.Url),
                        SSLId = GenerateSSLId(),
                        SiteId = site.Id
                    };
                    _context.SSLCertificates.Add(sslCert);
                }
                else
                {
                    _logger.LogInformation("Updating existing SSL certificate record {SSLId}", sslCert.SSLId);
                }

                // Update SSL certificate with check result
                UpdateSSLCertificateFromResult(sslCert, checkResult);

                // Add check result to history
                var checkResultEntity = new SSLCheckResult
                {
                    SSLCertificateId = sslCert.Id,
                    CheckDate = DateTime.UtcNow,
                    IsValid = checkResult.IsValid,
                    DaysRemaining = checkResult.DaysRemaining,
                    Status = checkResult.Status,
                    ErrorMessage = checkResult.ErrorMessage,
                    ResponseTimeMs = checkResult.ResponseTimeMs,
                    CertExpiryDate = checkResult.CertExpiryDate,
                    CertIssueDate = checkResult.CertIssueDate,
                    CertIssuer = checkResult.CertIssuer,
                    CertSubject = checkResult.CertSubject
                };

                // Only add to context if SSL certificate already has an ID (saved to database)
                if (sslCert.Id > 0)
                {
                    _context.SSLCheckResults.Add(checkResultEntity);
                }

                // Update site status
                site.LastChecked = DateTime.UtcNow;
                site.Status = checkResult.IsValid ? "up" : "down";

                await _context.SaveChangesAsync();
                
                // If SSL certificate was just created, add the check result now
                if (checkResultEntity.SSLCertificateId == 0)
                {
                    checkResultEntity.SSLCertificateId = sslCert.Id;
                    _context.SSLCheckResults.Add(checkResultEntity);
                    await _context.SaveChangesAsync();
                }

                _logger.LogInformation("SSL certificate update completed successfully for site {SiteId}", siteId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating SSL certificate for site {SiteId}", siteId);
                return false;
            }
        }

        public async Task<bool> UpdateAllSSLCertificatesAsync(string userId)
        {
            try
            {
                var sites = await _context.Sites
                    .Where(s => s.UserId == userId && s.IsActive)
                    .ToListAsync();

                _logger.LogInformation("Updating SSL certificates for {Count} sites for user {UserId}", sites.Count, userId);

                var tasks = sites.Select(site => UpdateSSLCertificateAsync(site.Id, userId));
                var results = await Task.WhenAll(tasks);

                var successCount = results.Count(r => r);
                _logger.LogInformation("SSL update completed: {Success}/{Total} sites successful", successCount, sites.Count);

                return results.All(r => r);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating all SSL certificates for user {UserId}", userId);
                return false;
            }
        }

        public async Task<SSLSummaryDto> GetSSLSummaryAsync(string userId)
        {
            var certificates = await _context.SSLCertificates
                .Include(s => s.Site)
                .Where(s => s.Site.UserId == userId)
                .ToListAsync();

            return new SSLSummaryDto
            {
                TotalCertificates = certificates.Count,
                ValidCertificates = certificates.Count(c => c.Status == "valid"),
                ExpiringCertificates = certificates.Count(c => c.Status == "expiring"),
                CriticalCertificates = certificates.Count(c => c.Status == "critical"),
                ExpiredCertificates = certificates.Count(c => c.Status == "expired")
            };
        }

        public async Task SendSSLExpiryAlertsAsync()
        {
            try
            {
                var expiringCerts = await _context.SSLCertificates
                    .Include(s => s.Site)
                    .ThenInclude(s => s.User)
                    .Where(s => s.DaysRemaining <= 30 && s.DaysRemaining > 0)
                    .ToListAsync();

                foreach (var cert in expiringCerts)
                {
                    // Check if alert was already sent today
                    if (cert.LastAlertSent?.Date == DateTime.Today) continue;

                    await _emailService.SendSSLExpiryAlertAsync(
                        cert.Site.User.Email,
                        cert.Domain,
                        cert.DaysRemaining,
                        cert.ExpiryDate ?? DateTime.MinValue);

                    cert.LastAlertSent = DateTime.UtcNow;
                    cert.AlertsSent = true;
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending SSL expiry alerts");
            }
        }

        private SSLCertificateDto MapToDto(SSLCertificate cert)
        {
            return new SSLCertificateDto
            {
                Id = cert.Id,
                Domain = cert.Domain,
                SSLId = cert.SSLId,
                ExpiryDate = cert.ExpiryDate,
                IssueDate = cert.IssueDate,
                Issuer = cert.Issuer,
                Status = cert.Status,
                DaysRemaining = cert.DaysRemaining,
                AlertsSent = cert.AlertsSent,
                LastAlertSent = cert.LastAlertSent,
                LastChecked = cert.LastChecked,
                SiteName = cert.Site?.Name,
                SiteUrl = cert.Site?.Url
            };
        }

        private void UpdateSSLCertificateFromResult(SSLCertificate cert, SSLCheckResult result)
        {
            cert.ExpiryDate = result.CertExpiryDate;
            cert.IssueDate = result.CertIssueDate;
            cert.Issuer = result.CertIssuer;
            cert.Status = result.Status;
            cert.DaysRemaining = result.DaysRemaining;
            cert.LastChecked = DateTime.UtcNow;
        }

        private string ExtractDomain(string url)
        {
            try
            {
                var uri = new Uri(url.StartsWith("http") ? url : $"https://{url}");
                return uri.Host;
            }
            catch
            {
                return url.Replace("https://", "").Replace("http://", "").Split('/')[0];
            }
        }

        private string GenerateSSLId()
        {
            var lastSSL = _context.SSLCertificates
                .OrderByDescending(s => s.Id)
                .FirstOrDefault();

            var nextId = (lastSSL?.Id ?? 0) + 1;
            return $"ssl_{nextId:D3}";
        }
    }
}