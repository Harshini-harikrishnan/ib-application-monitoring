using WebMonitorAPI.Models;

namespace WebMonitorAPI.Services
{
    public interface ISSLService
    {
        Task<SSLCheckResult> CheckSSLCertificateAsync(string domain);
        Task<SSLCheckResult> CheckSSLCertificateAsync(Site site);
        Task<List<SSLCheckResult>> CheckMultipleSitesAsync(List<Site> sites);
        Task<bool> IsCertificateExpiringAsync(string domain, int daysThreshold = 30);
        Task<int> GetDaysUntilExpiryAsync(string domain);
    }
}