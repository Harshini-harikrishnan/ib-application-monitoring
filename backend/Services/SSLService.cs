using System.Net.Security;
using System.Net.Sockets;
using System.Security.Cryptography.X509Certificates;
using WebMonitorAPI.Models;
using WebMonitorAPI.Services;

namespace WebMonitorAPI.Services
{
    public class SSLService : ISSLService
    {
        private readonly ILogger<SSLService> _logger;

        public SSLService(ILogger<SSLService> logger)
        {
            _logger = logger;
        }

        public async Task<SSLCheckResult> CheckSSLCertificateAsync(string domain)
        {
            var result = new SSLCheckResult();
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                // Remove protocol if present
                domain = domain.Replace("https://", "").Replace("http://", "");
                
                // Remove path if present
                if (domain.Contains("/"))
                {
                    domain = domain.Split('/')[0];
                }

                using var tcpClient = new TcpClient();
                await tcpClient.ConnectAsync(domain, 443);

                using var sslStream = new SslStream(tcpClient.GetStream(), false, ValidateServerCertificate);
                await sslStream.AuthenticateAsClientAsync(domain);

                var certificate = sslStream.RemoteCertificate as X509Certificate2;
                
                if (certificate != null)
                {
                    result.IsValid = true;
                    result.CertExpiryDate = certificate.NotAfter;
                    result.CertIssueDate = certificate.NotBefore;
                    result.CertIssuer = certificate.Issuer;
                    result.CertSubject = certificate.Subject;
                    
                    var daysRemaining = (certificate.NotAfter - DateTime.Now).Days;
                    result.DaysRemaining = Math.Max(0, daysRemaining);
                    
                    // Determine status based on days remaining
                    result.Status = GetSSLStatus(result.DaysRemaining);
                }
                else
                {
                    result.IsValid = false;
                    result.Status = "invalid";
                    result.ErrorMessage = "No certificate found";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking SSL certificate for domain: {Domain}", domain);
                result.IsValid = false;
                result.Status = "error";
                result.ErrorMessage = ex.Message;
            }
            finally
            {
                stopwatch.Stop();
                result.ResponseTimeMs = (int)stopwatch.ElapsedMilliseconds;
            }

            return result;
        }

        public async Task<SSLCheckResult> CheckSSLCertificateAsync(Site site)
        {
            var result = await CheckSSLCertificateAsync(site.Url);
            return result;
        }

        public async Task<List<SSLCheckResult>> CheckMultipleSitesAsync(List<Site> sites)
        {
            var tasks = sites.Select(site => CheckSSLCertificateAsync(site));
            var results = await Task.WhenAll(tasks);
            return results.ToList();
        }

        public async Task<bool> IsCertificateExpiringAsync(string domain, int daysThreshold = 30)
        {
            var result = await CheckSSLCertificateAsync(domain);
            return result.IsValid && result.DaysRemaining <= daysThreshold;
        }

        public async Task<int> GetDaysUntilExpiryAsync(string domain)
        {
            var result = await CheckSSLCertificateAsync(domain);
            return result.DaysRemaining;
        }

        private bool ValidateServerCertificate(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
        {
            // For monitoring purposes, we want to accept even invalid certificates to check their expiry
            return true;
        }

        private string GetSSLStatus(int daysRemaining)
        {
            return daysRemaining switch
            {
                <= 0 => "expired",
                <= 7 => "critical",
                <= 30 => "expiring",
                _ => "valid"
            };
        }
    }
}