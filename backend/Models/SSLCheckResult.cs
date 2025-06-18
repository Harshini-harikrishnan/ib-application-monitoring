namespace WebMonitorAPI.Models
{
    public class SSLCheckResult
    {
        public int Id { get; set; }
        public int SSLCertificateId { get; set; }
        public SSLCertificate SSLCertificate { get; set; }
        public DateTime CheckDate { get; set; }
        public bool IsValid { get; set; } // Add this
        public int DaysRemaining { get; set; }
        public string Status { get; set; }
        public string ErrorMessage { get; set; }
        public long ResponseTimeMs { get; set; } // Add this
        public DateTime? CertExpiryDate { get; set; } // Add this, nullable
        public DateTime? CertIssueDate { get; set; } // Add this, nullable
        public string CertIssuer { get; set; }
        public string CertSubject { get; set; }
    }
}