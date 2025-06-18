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

        public async Task SendSSLExpiryAlertAsync(string email, string domain, int daysRemaining, DateTime expiryDate)
        {
            var subject = $"SSL Certificate Expiry Alert - {domain}";
            var urgency = daysRemaining <= 7 ? "URGENT" : "WARNING";
            var body = $@"
                <h2 style='color: {(daysRemaining <= 7 ? "#dc2626" : "#f59e0b")};'>{urgency}: SSL Certificate Expiring Soon</h2>
                <p>The SSL certificate for <strong>{domain}</strong> is expiring soon.</p>
                <div style='background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;'>
                    <h3>Certificate Details:</h3>
                    <ul>
                        <li><strong>Domain:</strong> {domain}</li>
                        <li><strong>Days Remaining:</strong> {daysRemaining}</li>
                        <li><strong>Expiry Date:</strong> {expiryDate:yyyy-MM-dd HH:mm:ss} UTC</li>
                        <li><strong>Urgency Level:</strong> {urgency}</li>
                    </ul>
                </div>
                <p><strong>Action Required:</strong> Please renew this SSL certificate immediately to avoid service disruption.</p>
                <p>You can manage your SSL certificates in the WebMonitor dashboard.</p>
                <hr>
                <p style='font-size: 12px; color: #6b7280;'>
                    This is an automated alert from WebMonitor SSL Monitoring System.<br>
                    If you no longer wish to receive these alerts, please update your notification preferences in the dashboard.
                </p>
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