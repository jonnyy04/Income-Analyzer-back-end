using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions) { }

        // ✅ New for Lab 7
        public DbSet<Entry> Entries { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Entry → AppUser relationship
            builder.Entity<Entry>()
                .HasOne(e => e.AppUser)
                .WithMany()
                .HasForeignKey(e => e.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Precision for decimal columns
            builder.Entity<Entry>()
                .Property(e => e.Balance)
                .HasColumnType("decimal(18,2)");
            builder.Entity<Entry>()
                .Property(e => e.DailyProfit)
                .HasColumnType("decimal(18,2)");

            // Seed roles
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = "1", Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Id = "2", Name = "User", NormalizedName = "USER" }
            );
        }
    }
}
