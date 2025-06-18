using System.ComponentModel.DataAnnotations;

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
        
        // Foreign key to User - Fixed the duplicate UserId issue
        public string UserId { get; set; }
        
        // Navigation property
        public virtual ICollection<SSLCertificate> SSLCertificates { get; set; } = new List<SSLCertificate>();
    }
}