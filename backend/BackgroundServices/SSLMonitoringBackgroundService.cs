using WebMonitorAPI.Services;

namespace WebMonitorAPI.BackgroundServices
{
    public class SSLMonitoringBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<SSLMonitoringBackgroundService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromHours(6); // Check every 6 hours

        public SSLMonitoringBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<SSLMonitoringBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SSL Monitoring Background Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var sslMonitoringService = scope.ServiceProvider.GetRequiredService<ISSLMonitoringService>();

                    _logger.LogInformation("Starting SSL certificate checks");
                    
                    // Send SSL expiry alerts
                    await sslMonitoringService.SendSSLExpiryAlertsAsync();
                    
                    _logger.LogInformation("SSL certificate checks completed");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred during SSL monitoring");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("SSL Monitoring Background Service stopped");
        }
    }
}