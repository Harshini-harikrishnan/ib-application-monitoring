using System.ComponentModel.DataAnnotations;

namespace WebMonitorAPI.DTOs
{
    public class CreateSiteDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [MaxLength(500)]
        [Url]
        public string Url { get; set; } = null!;
    }

    public class UpdateSiteDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [MaxLength(500)]
        [Url]
        public string Url { get; set; } = null!;

        public bool IsActive { get; set; } = true;
    }

    public class SiteDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Url { get; set; } = null!;
        public string SiteId { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastChecked { get; set; }
        public string Status { get; set; } = null!;
        public SSLCertificateDto? SSLCertificate { get; set; } // Nullable to match optional relationship
        // Added performance-related fields
        public decimal? LastPerformanceScore { get; set; }
        public DateTime? LastPerformanceAudit { get; set; }
        public PerformanceMetricsDto? LatestPerformanceMetrics { get; set; } // Nullable for sites with no metrics
    }

    public class PerformanceMetricsDto
    {
        public int Id { get; set; }
        public decimal? PerformanceScore { get; set; }
        public decimal? AccessibilityScore { get; set; }
        public decimal? BestPracticesScore { get; set; }
        public decimal? SeoScore { get; set; }
        public decimal? PwaScore { get; set; }
        public DateTime AuditDate { get; set; }
        public string ReportUrl { get; set; } = null!;
    }
}