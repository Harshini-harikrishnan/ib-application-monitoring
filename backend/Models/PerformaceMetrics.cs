using System;
using System.Text.Json;

namespace WebMonitorAPI.Models
{
    public class PerformanceMetrics
    {
        public int Id { get; set; }
        public int SiteId { get; set; }
        public DateTime AuditDate { get; set; }
        public decimal? PerformanceScore { get; set; }
        public decimal? AccessibilityScore { get; set; }
        public decimal? BestPracticesScore { get; set; }
        public decimal? SeoScore { get; set; }
        public decimal? PwaScore { get; set; }
        public JsonElement Metrics { get; set; }
        public string ReportUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Site Site { get; set; }
    }
}