using System.ComponentModel.DataAnnotations;

namespace WebMonitorAPI.DTOs
{
    public class CreateSiteDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        
        [Required]
        [MaxLength(500)]
        [Url]
        public string Url { get; set; }
    }

    public class UpdateSiteDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        
        [Required]
        [MaxLength(500)]
        [Url]
        public string Url { get; set; }
        
        public bool IsActive { get; set; } = true;
    }

    public class SiteDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string SiteId { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastChecked { get; set; }
        public string Status { get; set; }
        public SSLCertificateDto SSLCertificate { get; set; }
    }
}