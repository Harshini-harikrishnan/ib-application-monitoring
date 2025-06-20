using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebMonitorAPI.DTOs;
using WebMonitorAPI.Models;
using WebMonitorAPI.Services;

namespace WebMonitorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SSLController : ControllerBase
    {
        private readonly ISSLMonitoringService _sslMonitoringService;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<SSLController> _logger;

        public SSLController(
            ISSLMonitoringService sslMonitoringService,
            UserManager<User> userManager,
            ILogger<SSLController> logger)
        {
            _sslMonitoringService = sslMonitoringService;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<SSLCertificateDto>>> GetAllSSLCertificates()
        {
            var userId = _userManager.GetUserId(User);
            var certificates = await _sslMonitoringService.GetAllSSLCertificatesAsync(userId);
            return Ok(certificates);
        }

        [HttpGet("expiring")]
        public async Task<ActionResult<List<SSLCertificateDto>>> GetExpiringCertificates([FromQuery] int days = 30)
        {
            var userId = _userManager.GetUserId(User);
            var certificates = await _sslMonitoringService.GetExpiringCertificatesAsync(userId, days);
            return Ok(certificates);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SSLCertificateDto>> GetSSLCertificate(int id)
        {
            var userId = _userManager.GetUserId(User);
            var certificate = await _sslMonitoringService.GetSSLCertificateByIdAsync(id, userId);
            
            if (certificate == null)
                return NotFound();
                
            return Ok(certificate);
        }
        [Authorize]
        [HttpGet("summary")]
        public async Task<ActionResult<SSLSummaryDto>> GetSSLSummary()
        {
            var userId = _userManager.GetUserId(User);
            var summary = await _sslMonitoringService.GetSSLSummaryAsync(userId);
            return Ok(summary);
        }

        [HttpPost("check")]
        public async Task<ActionResult> CheckSSLCertificate(SSLCheckRequestDto request)
        {
            var userId = _userManager.GetUserId(User);
            var success = await _sslMonitoringService.UpdateSSLCertificateAsync(request.SiteId, userId);
            
            if (!success)
                return BadRequest("Failed to check SSL certificate");
                
            return Ok(new { message = "SSL certificate checked successfully" });
        }

        [HttpPost("check-all")]
        public async Task<ActionResult> CheckAllSSLCertificates()
        {
            var userId = _userManager.GetUserId(User);
            var success = await _sslMonitoringService.UpdateAllSSLCertificatesAsync(userId);
            
            if (!success)
                return BadRequest("Failed to check SSL certificates");
                
            return Ok(new { message = "All SSL certificates checked successfully" });
        }

        [HttpPost("check-bulk")]
        public async Task<ActionResult> CheckBulkSSLCertificates(SSLBulkCheckRequestDto request)
        {
            var userId = _userManager.GetUserId(User);
            var results = new List<object>();
            
            foreach (var siteId in request.SiteIds)
            {
                var success = await _sslMonitoringService.UpdateSSLCertificateAsync(siteId, userId);
                results.Add(new { siteId, success });
            }
            
            return Ok(new { message = "Bulk SSL check completed", results });
        }

        [HttpPost("send-alerts")]
        public async Task<ActionResult> SendSSLExpiryAlerts()
        {
            await _sslMonitoringService.SendSSLExpiryAlertsAsync();
            return Ok(new { message = "SSL expiry alerts sent successfully" });
        }
    }
}