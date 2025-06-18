namespace WebMonitorAPI.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmailAsync(string email, string token);
        Task SendPasswordResetEmailAsync(string email, string token);
        Task SendSSLExpiryAlertAsync(string email, string domain, int daysRemaining, DateTime expiryDate);
    }
}