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
                    return Unauthorized("User not found");
                }
                
                var sites = await _context.Sites
                    .Include(s => s.SSLCertificates)
                    .Where(s => s.UserId == userId)
                    .OrderBy(s => s.Name)
                    .ToListAsync();

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
                    SSLCertificate = s.SSLCertificates?.FirstOrDefault() != null ? new SSLCertificateDto
                    {
                        Id = s.SSLCertificates.First().Id,
                        Domain = s.SSLCertificates.First().Domain,
                        SSLId = s.SSLCertificates.First().SSLId,
                        ExpiryDate = s.SSLCertificates.First().ExpiryDate,
                        Status = s.SSLCertificates.First().Status,
                        DaysRemaining = s.SSLCertificates.First().DaysRemaining,
                        LastChecked = s.SSLCertificates.First().LastChecked
                    } : null
                }).ToList();

                return Ok(siteDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving sites for user");
                return StatusCode(500, "Internal server error");
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
                    SSLCertificate = site.SSLCertificates?.FirstOrDefault() != null ? new SSLCertificateDto
                    {
                        Id = site.SSLCertificates.First().Id,
                        Domain = site.SSLCertificates.First().Domain,
                        SSLId = site.SSLCertificates.First().SSLId,
                        ExpiryDate = site.SSLCertificates.First().ExpiryDate,
                        Status = site.SSLCertificates.First().Status,
                        DaysRemaining = site.SSLCertificates.First().DaysRemaining,
                        LastChecked = site.SSLCertificates.First().LastChecked
                    } : null
                };

                return Ok(siteDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving site {SiteId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<SiteDto>> CreateSite(CreateSiteDto createSiteDto)
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not found");
                }
                
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

                _context.Sites.Add(site);
                await _context.SaveChangesAsync();

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
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSite(int id, UpdateSiteDto updateSiteDto)
        {
            try
            {
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

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating site {SiteId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSite(int id)
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
                    .ThenInclude(ssl => ssl.CheckResults)
                    .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

                if (site == null)
                    return NotFound();

                _context.Sites.Remove(site);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting site {SiteId}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}