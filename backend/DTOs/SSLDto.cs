namespace WebMonitorAPI.DTOs
{
    public class SSLCertificateDto
    {
        public int Id { get; set; }
        public string Domain { get; set; }
        public string SSLId { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime? IssueDate { get; set; }
        public string Issuer { get; set; }
        public string Status { get; set; }
        public int DaysRemaining { get; set; }
        public bool AlertsSent { get; set; }
        public DateTime? LastAlertSent { get; set; }
        public DateTime LastChecked { get; set; }
        public string SiteName { get; set; }
        public string SiteUrl { get; set; }
    }

    public class SSLSummaryDto
    {
        public int TotalCertificates { get; set; }
        public int ValidCertificates { get; set; }
        public int ExpiringCertificates { get; set; }
        public int CriticalCertificates { get; set; }
        public int ExpiredCertificates { get; set; }
    }

    public class SSLCheckRequestDto
    {
        public int SiteId { get; set; }
    }

    public class SSLBulkCheckRequestDto
    {
        public List<int> SiteIds { get; set; } = new List<int>();
    }
}