using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Nodes;
using WebMonitorAPI.Data;
using WebMonitorAPI.Models;

namespace WebMonitorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PerformanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<PerformanceController> _logger;

        public PerformanceController(ApplicationDbContext context, UserManager<User> userManager, ILogger<PerformanceController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet("{siteId}")]
        public async Task<ActionResult> GetPerformanceMetrics(int siteId)
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId)) return Unauthorized("User not found");

                var site = await _context.Sites.FirstOrDefaultAsync(s => s.Id == siteId && s.UserId == userId);
                if (site == null) return NotFound("Site not found");

                var metrics = await _context.PerformanceMetrics
                    .Where(m => m.SiteId == siteId)
                    .OrderByDescending(m => m.AuditDate)
                    .FirstOrDefaultAsync();

                if (metrics == null) return NotFound("No performance metrics found for this site");

                return Ok(new
                {
                    siteId = site.Id,
                    siteName = site.Name,
                    siteUrl = site.Url,
                    metrics = new
                    {
                        performanceScore = metrics.PerformanceScore,
                        accessibilityScore = metrics.AccessibilityScore,
                        bestPracticesScore = metrics.BestPracticesScore,
                        seoScore = metrics.SeoScore,
                        pwaScore = metrics.PwaScore,
                        detailedMetrics = metrics.Metrics,
                        reportUrl = metrics.ReportUrl,
                        auditDate = metrics.AuditDate
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving performance metrics for site {SiteId}", siteId);
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost("lighthouse/{siteId}")]
        public async Task<ActionResult> RunLighthouseAudit(int siteId)
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId)) return Unauthorized("User not found");

                var site = await _context.Sites.FirstOrDefaultAsync(s => s.Id == siteId && s.UserId == userId);
                if (site == null) return NotFound("Site not found");

                if (!Uri.TryCreate(site.Url, UriKind.Absolute, out var uri) || !(uri.Scheme == "http" || uri.Scheme == "https"))
                {
                    return BadRequest("Invalid site URL");
                }

                _logger.LogInformation("Starting Lighthouse audit for site: {SiteUrl}", site.Url);

                var lighthouseAvailable = await CheckLighthouseAvailability();
                if (!lighthouseAvailable)
                {
                    _logger.LogError("Lighthouse CLI not available");
                    return StatusCode(503, new { message = "Lighthouse service unavailable" });
                }

                var results = await RunLighthouseCommand(site.Id, site.Url);

                var performanceMetrics = new PerformanceMetrics
                {
                    SiteId = siteId,
                    AuditDate = DateTime.UtcNow,
                    PerformanceScore = results.performance,
                    AccessibilityScore = results.accessibility,
                    BestPracticesScore = results.bestPractices,
                    SeoScore = results.seo,
                    PwaScore = results.pwa,
                    Metrics = JsonSerializer.SerializeToElement(results.metrics),
                    ReportUrl = results.reportUrl,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.PerformanceMetrics.Add(performanceMetrics);

                // Update Sites table with latest performance data
                site.LastPerformanceScore = results.performance;
                site.LastPerformanceAudit = performanceMetrics.AuditDate;
                _context.Sites.Update(site);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Lighthouse audit completed",
                    results = new
                    {
                        performanceMetrics.Id,
                        performanceMetrics.SiteId,
                        performanceMetrics.AuditDate,
                        performanceMetrics.PerformanceScore,
                        performanceMetrics.AccessibilityScore,
                        performanceMetrics.BestPracticesScore,
                        performanceMetrics.SeoScore,
                        performanceMetrics.PwaScore,
                        metrics = results.metrics,
                        performanceMetrics.ReportUrl
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error running Lighthouse audit for site {SiteId}", siteId);
                return StatusCode(500, new { message = "Failed to run Lighthouse audit", details = ex.Message });
            }
        }
        [HttpGet("download-report/{siteId}")]
        public IActionResult DownloadLighthouseReport(int siteId)
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId)) return Unauthorized("User not found");

                var site = _context.Sites.FirstOrDefault(s => s.Id == siteId && s.UserId == userId);
                if (site == null) return NotFound("Site not found");

                var reportPath = Path.Combine(Path.GetTempPath(), $"report_{siteId}.html");
                if (!System.IO.File.Exists(reportPath))
                {
                    return NotFound("Lighthouse report not found");
                }

                var fileBytes = System.IO.File.ReadAllBytes(reportPath);
                return File(fileBytes, "text/html", $"lighthouse_report_{siteId}.html");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading Lighthouse report for site {SiteId}", siteId);
                return StatusCode(500, new { message = "Failed to download report", details = ex.Message });
            }
        }

        private async Task<bool> CheckLighthouseAvailability()
        {
            try
            {
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "lighthouse",
                        Arguments = "--version",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };

                process.Start();
                await process.WaitForExitAsync();
                var output = await process.StandardOutput.ReadToEndAsync();
                _logger.LogInformation("Lighthouse version: {Version}", output.Trim());
                return process.ExitCode == 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to check Lighthouse availability");
                return false;
            }
        }

        private async Task<(decimal performance, decimal accessibility, decimal bestPractices, decimal seo, decimal? pwa, object metrics, string reportUrl)> RunLighthouseCommand(int siteId, string url)
        {
            string tempFile = null;
            string htmlReportFile = null;
            try
            {
                tempFile = Path.Combine(Path.GetTempPath(), $"report_{siteId}.json");
                htmlReportFile = Path.Combine(Path.GetTempPath(), $"report_{siteId}.html");

                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "lighthouse",
                        Arguments = $"{url} --output=json --output=html --output-path={tempFile} --chrome-flags=\"--headless --no-sandbox\"",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };

                _logger.LogInformation("Running Lighthouse command for URL: {Url}", url);

                process.Start();

                var timeout = TimeSpan.FromMinutes(5);
                using var cts = new CancellationTokenSource(timeout);
                try
                {
                    await process.WaitForExitAsync(cts.Token);
                }
                catch (OperationCanceledException)
                {
                    process.Kill();
                    throw new TimeoutException("Lighthouse audit timed out");
                }

                if (process.ExitCode != 0)
                {
                    var error = await process.StandardError.ReadToEndAsync();
                    _logger.LogError("Lighthouse failed with exit code {ExitCode}: {Error}", process.ExitCode, error);
                    throw new Exception($"Lighthouse failed: {error}");
                }

                if (!System.IO.File.Exists(tempFile))
                    throw new FileNotFoundException("Lighthouse JSON output not found");

                var jsonContent = await System.IO.File.ReadAllTextAsync(tempFile);
                var json = JsonNode.Parse(jsonContent);
                var categories = json?["categories"] ?? throw new Exception("Invalid Lighthouse JSON: categories missing");

                decimal score(decimal? val) => val.HasValue ? Math.Round(val.Value * 100, 2) : 0;

                var performance = score(categories["performance"]?["score"]?.GetValue<decimal>());
                var accessibility = score(categories["accessibility"]?["score"]?.GetValue<decimal>());
                var bestPractices = score(categories["best-practices"]?["score"]?.GetValue<decimal>());
                var seo = score(categories["seo"]?["score"]?.GetValue<decimal>());
                var pwa = categories["pwa"]?["score"]?.GetValue<decimal>();

                var audits = json["audits"] ?? throw new Exception("Invalid Lighthouse JSON: audits missing");
                var metrics = new
                {
                    firstContentfulPaint = audits["first-contentful-paint"]?["numericValue"]?.GetValue<double>() ?? 0,
                    largestContentfulPaint = audits["largest-contentful-paint"]?["numericValue"]?.GetValue<double>() ?? 0,
                    cumulativeLayoutShift = audits["cumulative-layout-shift"]?["numericValue"]?.GetValue<double>() ?? 0,
                    speedIndex = audits["speed-index"]?["numericValue"]?.GetValue<double>() ?? 0,
                    totalBlockingTime = audits["total-blocking-time"]?["numericValue"]?.GetValue<double>() ?? 0
                };

                var reportUrl = $"/api/performance/download-report/{siteId}";
                return (performance, accessibility, bestPractices, seo, pwa, metrics, reportUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lighthouse command failed for URL: {Url}", url);
                throw;
            }
            finally
            {
                // Clean up temporary files
                if (tempFile != null && System.IO.File.Exists(tempFile))
                {
                    try { System.IO.File.Delete(tempFile); } catch { /* Log if needed */ }
                }
                // Note: Keep htmlReportFile for download endpoint; clean up via scheduled task or cloud storage
            }
        }
    }
}