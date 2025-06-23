using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebMonitorAPI.Data;
using WebMonitorAPI.DTOs;
using WebMonitorAPI.Models;

namespace WebMonitorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SitesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<SitesController> _logger;

        public SitesController(
            ApplicationDbContext context,
            UserManager<User> userManager,
            ILogger<SitesController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<SiteDto>>> GetSites()
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("GetSites called with no user ID");
                    return Unauthorized("User not found");
                }
                
                _logger.LogInformation("Getting sites for user: {UserId}", userId);
                
                var sites = await _context.Sites
                    .Include(s => s.SSLCertificates)
                    .Include(s => s.PerformanceMetrics)
                    .Where(s => s.UserId == userId)
                    .OrderBy(s => s.Name)
                    .ToListAsync();

                _logger.LogInformation("Found {Count} sites for user {UserId}", sites.Count, userId);

                var siteDtos = sites.Select(s => new SiteDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Url = s.Url,
                    SiteId = s.SiteId,
                    IsActive = s.IsActive,
                    CreatedDate = s.CreatedDate,
                    LastChecked = s.LastChecked,
                    Status = s.Status,
                    LastPerformanceScore = s.LastPerformanceScore,
                    LastPerformanceAudit = s.LastPerformanceAudit,
                    SSLCertificate = s.SSLCertificates?.FirstOrDefault() != null ? new SSLCertificateDto
                    {
                        Id = s.SSLCertificates.First().Id,
                        Domain = s.SSLCertificates.First().Domain,
                        SSLId = s.SSLCertificates.First().SSLId,
                        ExpiryDate = s.SSLCertificates.First().ExpiryDate,
                        Status = s.SSLCertificates.First().Status,
                        DaysRemaining = s.SSLCertificates.First().DaysRemaining,
                        LastChecked = s.SSLCertificates.First().LastChecked
                    } : null,
                    LatestPerformanceMetrics = s.PerformanceMetrics?.OrderByDescending(m => m.AuditDate).FirstOrDefault() != null ? new PerformanceMetricsDto
                    {
                        Id = s.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().Id,
                        PerformanceScore = s.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().PerformanceScore,
                        AccessibilityScore = s.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().AccessibilityScore,
                        BestPracticesScore = s.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().BestPracticesScore,
                        SeoScore = s.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().SeoScore,
                        PwaScore = s.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().PwaScore,
                        AuditDate = s.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().AuditDate,
                        ReportUrl = s.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().ReportUrl
                    } : null
                }).ToList();

                return Ok(siteDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving sites for user");
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SiteDto>> GetSite(int id)
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not found");
                }
                
                var site = await _context.Sites
                    .Include(s => s.SSLCertificates)
                    .Include(s => s.PerformanceMetrics)
                    .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

                if (site == null)
                    return NotFound();

                var siteDto = new SiteDto
                {
                    Id = site.Id,
                    Name = site.Name,
                    Url = site.Url,
                    SiteId = site.SiteId,
                    IsActive = site.IsActive,
                    CreatedDate = site.CreatedDate,
                    LastChecked = site.LastChecked,
                    Status = site.Status,
                    LastPerformanceScore = site.LastPerformanceScore,
                    LastPerformanceAudit = site.LastPerformanceAudit,
                    SSLCertificate = site.SSLCertificates?.FirstOrDefault() != null ? new SSLCertificateDto
                    {
                        Id = site.SSLCertificates.First().Id,
                        Domain = site.SSLCertificates.First().Domain,
                        SSLId = site.SSLCertificates.First().SSLId,
                        ExpiryDate = site.SSLCertificates.First().ExpiryDate,
                        Status = site.SSLCertificates.First().Status,
                        DaysRemaining = site.SSLCertificates.First().DaysRemaining,
                        LastChecked = site.SSLCertificates.First().LastChecked
                    } : null,
                    LatestPerformanceMetrics = site.PerformanceMetrics?.OrderByDescending(m => m.AuditDate).FirstOrDefault() != null ? new PerformanceMetricsDto
                    {
                        Id = site.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().Id,
                        PerformanceScore = site.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().PerformanceScore,
                        AccessibilityScore = site.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().AccessibilityScore,
                        BestPracticesScore = site.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().BestPracticesScore,
                        SeoScore = site.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().SeoScore,
                        PwaScore = site.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().PwaScore,
                        AuditDate = site.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().AuditDate,
                        ReportUrl = site.PerformanceMetrics.OrderByDescending(m => m.AuditDate).First().ReportUrl
                    } : null
                };

                return Ok(siteDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving site {SiteId}", id);
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<SiteDto>> CreateSite(CreateSiteDto createSiteDto)
        {
            try
            {
                _logger.LogInformation("CreateSite called with data: {@CreateSiteDto}", createSiteDto);

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("CreateSite called with invalid model state: {@ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                var userId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("CreateSite called with no user ID");
                    return Unauthorized("User not found");
                }
                
                _logger.LogInformation("Creating site for user: {UserId}", userId);

                // Generate unique site ID
                var lastSite = await _context.Sites
                    .OrderByDescending(s => s.Id)
                    .FirstOrDefaultAsync();
                
                var nextId = (lastSite?.Id ?? 0) + 1;
                var siteId = $"site_{nextId:D3}";

                var site = new Site
                {
                    Name = createSiteDto.Name,
                    Url = createSiteDto.Url,
                    SiteId = siteId,
                    UserId = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true,
                    Status = "unknown"
                };

                _logger.LogInformation("Adding site to database: {@Site}", new { site.Name, site.Url, site.SiteId, site.UserId });

                _context.Sites.Add(site);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Site created successfully with ID: {SiteId}", site.Id);

                var siteDto = new SiteDto
                {
                    Id = site.Id,
                    Name = site.Name,
                    Url = site.Url,
                    SiteId = site.SiteId,
                    IsActive = site.IsActive,
                    CreatedDate = site.CreatedDate,
                    LastChecked = site.LastChecked,
                    Status = site.Status
                };

                return CreatedAtAction(nameof(GetSite), new { id = site.Id }, siteDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating site");
                return StatusCode(500, new { message = "Internal server error", details = ex.Message});
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSite(int id, UpdateSiteDto updateSiteDto)
        {
            try
            {
                _logger.LogInformation("UpdateSite called for ID {SiteId} with data: {@UpdateSiteDto}", id, updateSiteDto);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not found");
                }
                
                var site = await _context.Sites
                    .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

                if (site == null)
                    return NotFound();

                site.Name = updateSiteDto.Name;
                site.Url = updateSiteDto.Url;
                site.IsActive = updateSiteDto.IsActive;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Site updated successfully: {SiteId}", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating site {SiteId}", id);
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSite(int id)
        {
            try
            {
                _logger.LogInformation("DeleteSite called for ID: {SiteId}", id);

                var userId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not found");
                }
                
                var site = await _context.Sites
                    .Include(s => s.SSLCertificates)
                    .ThenInclude(ssl => ssl.CheckResults)
                    .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

                if (site == null)
                    return NotFound();

                _context.Sites.Remove(site);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Site deleted successfully: {SiteId}", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting site {SiteId}", id);
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }
}