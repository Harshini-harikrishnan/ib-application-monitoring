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
                _logger.LogInformation("Starting SSL check for domain: {Domain}", domain);

                // Clean the domain - remove protocol and path
                domain = CleanDomain(domain);
                _logger.LogInformation("Cleaned domain: {Domain}", domain);

                using var tcpClient = new TcpClient();
                
                // Set timeout for connection
                var connectTask = tcpClient.ConnectAsync(domain, 443);
                var timeoutTask = Task.Delay(10000); // 10 second timeout
                
                var completedTask = await Task.WhenAny(connectTask, timeoutTask);
                if (completedTask == timeoutTask)
                {
                    throw new TimeoutException($"Connection to {domain}:443 timed out");
                }

                if (!tcpClient.Connected)
                {
                    throw new Exception($"Failed to connect to {domain}:443");
                }

                _logger.LogInformation("TCP connection established to {Domain}:443", domain);

                using var sslStream = new SslStream(tcpClient.GetStream(), false, ValidateServerCertificate);
                
                // Authenticate as client
                await sslStream.AuthenticateAsClientAsync(domain);
                _logger.LogInformation("SSL handshake completed for {Domain}", domain);

                var certificate = sslStream.RemoteCertificate as X509Certificate2;
                
                if (certificate != null)
                {
                    _logger.LogInformation("Certificate found for {Domain}", domain);
                    _logger.LogInformation("Certificate Subject: {Subject}", certificate.Subject);
                    _logger.LogInformation("Certificate Issuer: {Issuer}", certificate.Issuer);
                    _logger.LogInformation("Certificate Valid From: {NotBefore}", certificate.NotBefore);
                    _logger.LogInformation("Certificate Valid To: {NotAfter}", certificate.NotAfter);

                    result.IsValid = true;
                    result.CertExpiryDate = certificate.NotAfter;
                    result.CertIssueDate = certificate.NotBefore;
                    result.CertIssuer = ExtractOrganizationFromDN(certificate.Issuer);
                    result.CertSubject = ExtractOrganizationFromDN(certificate.Subject);
                    
                    var daysRemaining = (certificate.NotAfter - DateTime.Now).Days;
                    result.DaysRemaining = Math.Max(0, daysRemaining);
                    
                    // Determine status based on days remaining
                    result.Status = GetSSLStatus(result.DaysRemaining);
                    
                    _logger.LogInformation("SSL certificate for {Domain} expires in {Days} days", domain, result.DaysRemaining);
                }
                else
                {
                    _logger.LogWarning("No certificate found for {Domain}", domain);
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
                _logger.LogInformation("SSL check completed for {Domain} in {ResponseTime}ms", domain, result.ResponseTimeMs);
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
            // We'll log the policy errors but still return true to get certificate information
            if (sslPolicyErrors != SslPolicyErrors.None)
            {
                _logger.LogWarning("SSL Policy Errors detected: {Errors}", sslPolicyErrors);
            }
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

        private string CleanDomain(string url)
        {
            try
            {
                // Remove protocol if present
                url = url.Replace("https://", "").Replace("http://", "");
                
                // Remove www. prefix if present
                if (url.StartsWith("www."))
                {
                    url = url.Substring(4);
                }
                
                // Remove path if present
                if (url.Contains("/"))
                {
                    url = url.Split('/')[0];
                }
                
                // Remove port if present
                if (url.Contains(":"))
                {
                    url = url.Split(':')[0];
                }
                
                return url.Trim();
            }
            catch
            {
                return url;
            }
        }

        private string ExtractOrganizationFromDN(string distinguishedName)
        {
            try
            {
                // Parse the distinguished name to extract organization
                var parts = distinguishedName.Split(',');
                
                foreach (var part in parts)
                {
                    var trimmedPart = part.Trim();
                    if (trimmedPart.StartsWith("O="))
                    {
                        return trimmedPart.Substring(2);
                    }
                    else if (trimmedPart.StartsWith("CN="))
                    {
                        // If no organization found, use common name
                        var cn = trimmedPart.Substring(3);
                        // Clean up common name (remove wildcards, etc.)
                        return cn.Replace("*.", "").Split('.')[0];
                    }
                }
                
                // If nothing found, return the first part
                return parts.Length > 0 ? parts[0].Trim() : distinguishedName;
            }
            catch
            {
                return distinguishedName;
            }
        }
    }
}