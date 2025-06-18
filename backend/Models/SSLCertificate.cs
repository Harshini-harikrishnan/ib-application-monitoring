using System.ComponentModel.DataAnnotations;

namespace WebMonitorAPI.Models
{
    public class SSLCertificate
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Domain { get; set; }
        
        [MaxLength(50)]
        public string SSLId { get; set; } // Custom SSL identifier like "ssl_001"
        
        public DateTime? ExpiryDate { get; set; }
        
        public DateTime? IssueDate { get; set; }
        
        [MaxLength(100)]
        public string Issuer { get; set; }
        
        [MaxLength(50)]
        public string Status { get; set; } = "unknown"; // valid, expiring, critical, expired, invalid
        
        public int DaysRemaining { get; set; } = 0;
        
        public bool AlertsSent { get; set; } = false;
        
        public DateTime? LastAlertSent { get; set; }
        
        public DateTime LastChecked { get; set; } = DateTime.UtcNow;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        // Foreign key to Site
        public int SiteId { get; set; }
        public Site Site { get; set; }
        
        // Navigation property
        public virtual ICollection<SSLCheckResult> CheckResults { get; set; } = new List<SSLCheckResult>();
    }
}