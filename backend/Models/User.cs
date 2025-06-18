using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace WebMonitorAPI.Models
{
    public class User : IdentityUser
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        public int Age { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string State { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLogin { get; set; }
        public bool IsEmailVerified { get; set; } = false;
        public string? EmailVerificationToken { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetExpiry { get; set; }
    }
}