# Complete Authentication System Setup Guide

## Frontend (Next.js) - Already Implemented ✅

The frontend authentication system includes:
- **Login Form** with email/password and Google OAuth
- **Signup Form** with multi-step registration
- **Forgot Password** functionality
- **Form validation** and error handling
- **JWT token management**
- **Protected routes** (to be implemented)

## Backend (.NET Core) Setup Instructions

### 1. Create .NET Web API Project

```bash
# Create new Web API project
dotnet new webapi -n WebMonitorAPI
cd WebMonitorAPI

# Add required NuGet packages
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Oracle.EntityFrameworkCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.AspNetCore.Authentication.Google
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package BCrypt.Net-Next
dotnet add package MailKit
dotnet add package MimeKit
```

### 2. Oracle Database Setup

#### Get Free Oracle Account:

1. **Visit Oracle Cloud**: https://www.oracle.com/cloud/free/
2. **Sign up** for Oracle Cloud Free Tier
3. **Create Autonomous Database**:
   - Go to Oracle Cloud Console
   - Navigate to "Autonomous Database"
   - Click "Create Autonomous Database"
   - Choose "Always Free" tier
   - Database name: `webmonitor_db`
   - Admin password: Create strong password

#### Connection Details:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=your_oracle_connection_string;User Id=ADMIN;Password=your_password;"
  }
}
```

### 3. Database Models (.NET)

Create `Models/User.cs`:
```csharp
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace WebMonitorAPI.Models
{
    public class User : IdentityUser
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string LastName { get; set; }
        
        [Required]
        public int Age { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string State { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string City { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLogin { get; set; }
        public bool IsEmailVerified { get; set; } = false;
        public string? EmailVerificationToken { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetExpiry { get; set; }
    }
}
```

### 4. Database Context

Create `Data/ApplicationDbContext.cs`:
```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebMonitorAPI.Models;

namespace WebMonitorAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
            // Configure Oracle-specific settings
            builder.Entity<User>(entity =>
            {
                entity.Property(e => e.FirstName).HasMaxLength(50);
                entity.Property(e => e.LastName).HasMaxLength(50);
                entity.Property(e => e.State).HasMaxLength(100);
                entity.Property(e => e.City).HasMaxLength(100);
            });
        }
    }
}
```

### 5. Authentication Controller

Create `Controllers/AuthController.cs`:
```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebMonitorAPI.Models;
using WebMonitorAPI.DTOs;
using WebMonitorAPI.Services;

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

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

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
                EmailVerificationToken = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Send verification email
                await _emailService.SendVerificationEmailAsync(user.Email, user.EmailVerificationToken);
                
                return Ok(new { message = "Account created successfully. Please check your email to verify your account." });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid email or password" });

            if (!user.IsEmailVerified)
                return Unauthorized(new { message = "Please verify your email before logging in" });

            // Update last login
            user.LastLogin = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            var token = GenerateJwtToken(user);
            
            return Ok(new
            {
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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Ok(new { message = "If an account with that email exists, we've sent a password reset link." });

            var token = Guid.NewGuid().ToString();
            user.PasswordResetToken = token;
            user.PasswordResetExpiry = DateTime.UtcNow.AddHours(1);
            
            await _userManager.UpdateAsync(user);
            await _emailService.SendPasswordResetEmailAsync(user.Email, token);

            return Ok(new { message = "If an account with that email exists, we've sent a password reset link." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
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

            return BadRequest(result.Errors);
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto model)
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

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
```

### 6. DTOs (Data Transfer Objects)

Create `DTOs/AuthDtos.cs`:
```csharp
using System.ComponentModel.DataAnnotations;

namespace WebMonitorAPI.DTOs
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; }
    }

    public class SignupDto
    {
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Phone { get; set; }
        
        [Required]
        public string Age { get; set; }
        
        [Required]
        public string State { get; set; }
        
        [Required]
        public string City { get; set; }
        
        [Required]
        [MinLength(8)]
        public string Password { get; set; }
    }

    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }
        
        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; }
    }

    public class VerifyEmailDto
    {
        [Required]
        public string Token { get; set; }
    }
}
```

### 7. Email Service

Create `Services/IEmailService.cs`:
```csharp
namespace WebMonitorAPI.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmailAsync(string email, string token);
        Task SendPasswordResetEmailAsync(string email, string token);
    }
}
```

Create `Services/EmailService.cs`:
```csharp
using MailKit.Net.Smtp;
using MimeKit;

namespace WebMonitorAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendVerificationEmailAsync(string email, string token)
        {
            var verificationUrl = $"{_configuration["Frontend:BaseUrl"]}/verify-email?token={token}";
            var subject = "Verify Your Email - WebMonitor";
            var body = $@"
                <h2>Welcome to WebMonitor!</h2>
                <p>Please click the link below to verify your email address:</p>
                <a href='{verificationUrl}'>Verify Email</a>
                <p>If you didn't create this account, please ignore this email.</p>
            ";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendPasswordResetEmailAsync(string email, string token)
        {
            var resetUrl = $"{_configuration["Frontend:BaseUrl"]}/reset-password?token={token}";
            var subject = "Reset Your Password - WebMonitor";
            var body = $@"
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password:</p>
                <a href='{resetUrl}'>Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            ";

            await SendEmailAsync(email, subject, body);
        }

        private async Task SendEmailAsync(string email, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("WebMonitor", _configuration["Email:From"]));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = body };

            using var client = new SmtpClient();
            await client.ConnectAsync(_configuration["Email:Host"], int.Parse(_configuration["Email:Port"]), true);
            await client.AuthenticateAsync(_configuration["Email:Username"], _configuration["Email:Password"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
```

### 8. Program.cs Configuration

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebMonitorAPI.Data;
using WebMonitorAPI.Models;
using WebMonitorAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseOracle(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
})
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Google:ClientId"];
    options.ClientSecret = builder.Configuration["Google:ClientSecret"];
});

builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### 9. Configuration (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=your_oracle_connection_string;User Id=ADMIN;Password=your_password;"
  },
  "Jwt": {
    "Key": "your-super-secret-jwt-key-that-is-at-least-32-characters-long",
    "Issuer": "WebMonitorAPI",
    "Audience": "WebMonitorClient"
  },
  "Google": {
    "ClientId": "your-google-client-id",
    "ClientSecret": "your-google-client-secret"
  },
  "Email": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "Username": "your-email@gmail.com",
    "Password": "your-app-password",
    "From": "noreply@webmonitor.com"
  },
  "Frontend": {
    "BaseUrl": "http://localhost:3000"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### 10. Database Migration

```bash
# Add migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

### 11. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://localhost:7001/signin-google`

### 12. Run the Application

```bash
# Backend
dotnet run

# Frontend (in your Next.js project)
npm run dev
```

## Environment Variables (.env.local)

Create `.env.local` in your Next.js project:
```
NEXT_PUBLIC_API_URL=https://localhost:7001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## Features Implemented ✅

- ✅ User registration with validation
- ✅ Email/password login
- ✅ Google OAuth integration
- ✅ Email verification
- ✅ Password reset functionality
- ✅ JWT token authentication
- ✅ Oracle database integration
- ✅ Form validation and error handling
- ✅ Multi-step signup form
- ✅ Responsive design

## Next Steps

1. Implement protected routes in Next.js
2. Add role-based access control
3. Implement refresh token mechanism
4. Add user profile management
5. Set up email templates
6. Add rate limiting
7. Implement audit logging
