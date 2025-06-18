using WebMonitorAPI.Models;
using WebMonitorAPI.DTOs;

namespace WebMonitorAPI.Services
{
    public interface ISSLMonitoringService
    {
        Task<List<SSLCertificateDto>> GetAllSSLCertificatesAsync(string userId);
        Task<List<SSLCertificateDto>> GetExpiringCertificatesAsync(string userId, int daysThreshold = 30);
        Task<SSLCertificateDto> GetSSLCertificateByIdAsync(int id, string userId);
        Task<bool> UpdateSSLCertificateAsync(int siteId, string userId);
        Task<bool> UpdateAllSSLCertificatesAsync(string userId);
        Task<SSLSummaryDto> GetSSLSummaryAsync(string userId);
        Task SendSSLExpiryAlertsAsync();
    }
}