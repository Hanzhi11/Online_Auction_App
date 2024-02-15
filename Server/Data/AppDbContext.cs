using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Server.Model;
using Server.Models;

namespace Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<State> State { get; set; }
    public DbSet<Address> Address { get; set; }
    public DbSet<PropertyType> PropertyType { get; set; }
    public DbSet<Agency> Agency { get; set; }
    public DbSet<Person> Person { get; set; }
    public DbSet<PersonRole> PersonRole{ get; set; }
    public DbSet<Role> Role { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>()
            .HasAlternateKey(a => new { a.UnitNumber, a.StreetNumber, a.Street, a.Suburb, a.StatePostCode });

        modelBuilder.Entity<PropertyType>()
        .HasData(
            new ("house"),
            new ("townhouse"),
            new ("unit"),
            new ("land")
        );
        modelBuilder.Entity<Role>()
        .HasData(
            new ("agent"),
            new ("auctioneer")
        );
    }

    public override int SaveChanges()
    {
        var entities = from e in ChangeTracker.Entries()
                       where e.State == EntityState.Added
                           || e.State == EntityState.Modified
                       select e.Entity;
        foreach (var entity in entities)
        {
            var validationContext = new ValidationContext(entity);
            Validator.ValidateObject(
                entity,
                validationContext,
                validateAllProperties: true);
        }
        return base.SaveChanges();
    }

}
