using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Server.Models;

namespace Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<State> State { get; set; }
    public DbSet<Address> Address { get; set; }
    public DbSet<PropertyType> PropertyType { get; set; }
    public DbSet<Agency> Agency { get; set; }
    public DbSet<Person> Person { get; set; }
    public DbSet<PersonRole> PersonRole { get; set; }
    public DbSet<Role> Role { get; set; }
    public DbSet<Listing> Listing { get; set; }
    public DbSet<ListingAgent> ListingAgent { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>()
            .HasAlternateKey(a => new { a.UnitNumber, a.StreetNumber, a.Street, a.Suburb, a.StatePostCode });
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

    public bool HasData()
    {
        Database.OpenConnection();
        foreach (IEntityType entityType in Model.GetEntityTypes())
        {
            string? tableName = entityType.GetTableName();
            if (tableName != null)
            {
                string sql = $"SELECT Count(*) FROM \"{tableName}\"";

                DbCommand cmd = Database.GetDbConnection().CreateCommand();
                cmd.CommandText = sql;
                object? result = cmd.ExecuteScalar();
                Int64 count = result != null ? (Int64)result : 0;

                if (count > 0)
                {
                    Database.CloseConnection();
                    return true;
                }
            }
        }
        Database.CloseConnection();
        return false;
    }
}
