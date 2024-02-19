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

        modelBuilder.Entity<State>()
        .HasData(
            new("4113", "QLD"),
            new("4109", "QLD"),
            new("4116", "QLD"),
            new("4122", "QLD")
        );

        modelBuilder.Entity<Role>()
        .HasData(
            new("agent"),
            new("auctioneer")
        );

        modelBuilder.Entity<PropertyType>()
        .HasData(
            new("house"),
            new("townhouse"),
            new("unit"),
            new("land")
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

    private readonly List<string> ExcludedTables = ["__EFMigrationsHistory", "State", "Role", "PropertyType"];

    public void TruncateTables()
    {
        Database.OpenConnection();
        foreach (IEntityType entityType in Model.GetEntityTypes())
        {
            string? tableName = entityType.GetTableName();
            if (tableName != null && !ExcludedTables.Contains(tableName))
            {
                string truncateSql = $"TRUNCATE TABLE \"{tableName}\" CASCADE";
                Database.ExecuteSqlRaw(truncateSql);
            }
        }
        Database.CloseConnection();
    }

    public bool HasCustomData()
    {
        Database.OpenConnection();
        bool hasData = false;
        foreach (IEntityType entityType in Model.GetEntityTypes())
        {
            string? tableName = entityType.GetTableName();
            if (tableName != null && !ExcludedTables.Contains(tableName))
            {
                string sql = $"SELECT Count(*) FROM \"{tableName}\"";

                DbCommand cmd = Database.GetDbConnection().CreateCommand();
                cmd.CommandText = sql;
                object? result = cmd.ExecuteScalar();
                Int64 count = result != null ? (Int64)result : 0;

                if (count > 0)
                {
                    hasData = true;
                    break;
                }
            }
        }
        Database.CloseConnection();
        return hasData;
    }
}
