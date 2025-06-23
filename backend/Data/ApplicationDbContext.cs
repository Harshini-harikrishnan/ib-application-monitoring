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

        public DbSet<Site> Sites { get; set; } = null!;
        public DbSet<SSLCertificate> SSLCertificates { get; set; } = null!;
        public DbSet<SSLCheckResult> SSLCheckResults { get; set; } = null!;
        public DbSet<PerformanceMetrics> PerformanceMetrics { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure User entity
            builder.Entity<User>(entity =>
            {
                entity.Property(e => e.FirstName).HasMaxLength(50).IsRequired();
                entity.Property(e => e.LastName).HasMaxLength(50).IsRequired();
                entity.Property(e => e.State).HasMaxLength(100).IsRequired();
                entity.Property(e => e.City).HasMaxLength(100).IsRequired();
            });

            // Configure Site entity
            builder.Entity<Site>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Url).HasMaxLength(500).IsRequired();
                entity.Property(e => e.SiteId).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("unknown");
                entity.Property(e => e.UserId).IsRequired();

                // Foreign key relationship with User
                entity.HasOne<User>(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Relationships with SSLCertificates and PerformanceMetrics
                entity.HasMany(s => s.SSLCertificates)
                    .WithOne(c => c.Site)
                    .HasForeignKey(c => c.SiteId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(s => s.PerformanceMetrics)
                    .WithOne(m => m.Site)
                    .HasForeignKey(m => m.SiteId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.SiteId).IsUnique();
                entity.HasIndex(e => e.UserId);
            });

            // Configure SSLCertificate entity
            builder.Entity<SSLCertificate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Domain).HasMaxLength(255).IsRequired();
                entity.Property(e => e.SSLId).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Issuer).HasMaxLength(100);
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("unknown");
                entity.Property(e => e.SiteId).IsRequired();

                entity.HasOne(e => e.Site)
                    .WithMany(s => s.SSLCertificates)
                    .HasForeignKey(e => e.SiteId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.SSLId).IsUnique();
                entity.HasIndex(e => e.SiteId);
            });

            // Configure SSLCheckResult entity
            builder.Entity<SSLCheckResult>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.ErrorMessage).HasMaxLength(500);
                entity.Property(e => e.CertIssuer).HasMaxLength(100);
                entity.Property(e => e.CertSubject).HasMaxLength(100);
                entity.Property(e => e.SSLCertificateId).IsRequired();

                entity.HasOne(e => e.SSLCertificate)
                    .WithMany(s => s.CheckResults)
                    .HasForeignKey(e => e.SSLCertificateId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.SSLCertificateId);
            });

            // Configure PerformanceMetrics entity
            builder.Entity<PerformanceMetrics>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SiteId).IsRequired();
                entity.Property(e => e.AuditDate).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();
                entity.Property(e => e.ReportUrl).HasMaxLength(500);

                entity.HasOne(e => e.Site)
                    .WithMany(s => s.PerformanceMetrics)
                    .HasForeignKey(e => e.SiteId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.SiteId);
            });
        }
    }
}