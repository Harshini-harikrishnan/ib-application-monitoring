using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebMonitorAPI.Models;
using WebMonitorAPI.DTOs;
using WebMonitorAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace WebMonitorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            IEmailService emailService,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var existingUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                    return BadRequest(new { message = "User with this email already exists" });

                var user = new User
                {
                    UserName = model.Email,
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    PhoneNumber = model.Phone,
                    Age = int.Parse(model.Age),
                    State = model.State,
                    City = model.City,
                    EmailVerificationToken = Guid.NewGuid().ToString(),
                    IsEmailVerified = true // For development, auto-verify emails
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("User created successfully: {Email}", user.Email);
                    
                    // For development, we'll skip email verification
                    // await _emailService.SendVerificationEmailAsync(user.Email, user.EmailVerificationToken);
                    
                    return Ok(new { 
                        success = true,
                        message = "Account created successfully. You can now log in." 
                    });
                }

                return BadRequest(new { 
                    success = false,
                    message = "Failed to create account",
                    errors = result.Errors.Select(e => e.Description)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during signup");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                    return Unauthorized(new { message = "Invalid email or password" });

                // 🔐 Email confirmation check
                if (!await _userManager.IsEmailConfirmedAsync(user))
                    return Unauthorized(new { message = "Email not confirmed. Please verify your email before logging in." });

                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                if (!result.Succeeded)
                    return Unauthorized(new { message = "Invalid email or password" });

                user.LastLogin = DateTime.UtcNow;
                await _userManager.UpdateAsync(user);

                var token = GenerateJwtToken(user);

                _logger.LogInformation("User logged in successfully: {Email}", user.Email);

                return Ok(new
                {
                    success = true,
                    token,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        phone = user.PhoneNumber,
                        age = user.Age,
                        state = user.State,
                        city = user.City,
                        isEmailVerified = user.IsEmailVerified,
                        lastLogin = user.LastLogin
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                    return Ok(new { message = "If an account with that email exists, we've sent a password reset link." });

                var token = Guid.NewGuid().ToString();
                user.PasswordResetToken = token;
                user.PasswordResetExpiry = DateTime.UtcNow.AddHours(1);
                
                await _userManager.UpdateAsync(user);
                
                // For development, we'll skip sending actual emails
                // await _emailService.SendPasswordResetEmailAsync(user.Email, token);
                
                _logger.LogInformation("Password reset requested for: {Email}", user.Email);

                return Ok(new { message = "If an account with that email exists, we've sent a password reset link." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during forgot password");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            try
            {
                var user = await _userManager.Users
                    .FirstOrDefaultAsync(u => u.PasswordResetToken == model.Token && 
                                             u.PasswordResetExpiry > DateTime.UtcNow);

                if (user == null)
                    return BadRequest(new { message = "Invalid or expired reset token" });

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

                if (result.Succeeded)
                {
                    user.PasswordResetToken = null;
                    user.PasswordResetExpiry = null;
                    await _userManager.UpdateAsync(user);
                    
                    return Ok(new { message = "Password reset successfully" });
                }

                return BadRequest(new { 
                    message = "Failed to reset password",
                    errors = result.Errors.Select(e => e.Description)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto model)
        {
            try
            {
                var user = await _userManager.Users
                    .FirstOrDefaultAsync(u => u.EmailVerificationToken == model.Token);

                if (user == null)
                    return BadRequest(new { message = "Invalid verification token" });

                user.IsEmailVerified = true;
                user.EmailVerificationToken = null;
                await _userManager.UpdateAsync(user);

                return Ok(new { message = "Email verified successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during email verification");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("google")]
        public IActionResult GoogleLogin()
        {
            // For development, we'll return a simple message
            return Ok(new { message = "Google OAuth not implemented in development mode" });
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var keyString = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(keyString))
                throw new InvalidOperationException("JWT Key is missing in configuration.");

            var key = Encoding.ASCII.GetBytes(keyString);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id ?? throw new InvalidOperationException("User ID is null")),
                    new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                    new Claim(ClaimTypes.Name, $"{user.FirstName ?? string.Empty} {user.LastName ?? string.Empty}".Trim())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is missing"),
                Audience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is missing")
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}