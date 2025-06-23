using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace WebMonitorAPI.Models
{
    public class Site
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Url { get; set; }
        
        [MaxLength(50)]
        public string SiteId { get; set; } // Custom site identifier like "site_001"
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastChecked { get; set; }
        
        [MaxLength(20)]
        public string Status { get; set; } = "unknown"; // up, down, maintenance, unknown
        
        // Optional: Add field to reflect latest performance
        public decimal? LastPerformanceScore { get; set; } // Stores latest PerformanceScore
        public DateTime? LastPerformanceAudit { get; set; } // Stores latest AuditDate
        
        // Foreign key to User
        public string UserId { get; set; } = null!;
        public User User { get; set; } = null!;
        
        // Navigation properties
        public virtual ICollection<SSLCertificate> SSLCertificates { get; set; } = new List<SSLCertificate>();
        public virtual ICollection<PerformanceMetrics> PerformanceMetrics { get; set; } = new List<PerformanceMetrics>();
    }
}