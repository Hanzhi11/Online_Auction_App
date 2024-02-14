using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Server.Data;

namespace Server.Models;

public static class SeedData
{
    public static void Initialze(IServiceProvider serviceProvider)
    {
        using var context = new AppDbContext(
            serviceProvider.GetRequiredService<
            DbContextOptions<AppDbContext>>());

        try
        {
            bool canConnect = context.Database.GetService<IDatabaseCreator>().CanConnect();
            if (canConnect)
            {
                // Drop the database if it exists
                context.Database.EnsureDeleted();
                // Create the database if it doesn't exist
                context.Database.EnsureCreated();
            }

            State state1 = new("4113", "QLD");
            State state2 = new("4109", "QLD");
            State state3 = new("4116", "QLD");
            context.State.AddRange(
                state1, state2, state3
            );
            context.Address.AddRange(
                new Address("28", "Meihua Street", "Wanhuayuan Meihuayuan District", "4113"),
                new Address("14", "Meihua Street", "Wanhuayuan Meihuayuan District", "4113")
                {
                    UnitNumber = "1"
                },
                new Address("14", "Meihua Street", "Wanhuayuan Meihuayuan District", "4113")
                {
                    UnitNumber = "2"
                },
                new Address("14", "Meihua Street", "Wanhuayuan Meihuayuan District", "4113")
                {
                    UnitNumber = "3"
                },
                new Address("14", "Meihua Street", "Wanhuayuan Meihuayuan District", "4113")
                {
                    UnitNumber = "4"
                },
                new Address("15", "Meihua Street", "Wanhuayuan Meihuayuan District", "4113"),
                new Address("15", "Hehua Street", "Wanhuayuan Hehuayuan", "4109"),
                new Address("5", "Hehua Street", "Wanhuayuan Hehuayuan", "4109"),
                new Address("6", "Hehua Street", "Wanhuayuan Hehuayuan", "4109")
            );
            context.SaveChanges();
        }
        catch (Exception ex)
        {
            if (ex is DbUpdateException)
            {
                Console.WriteLine("SQL State is " + ex.InnerException?.Data["SqlState"]);
                Console.WriteLine("Error Message is " + ex.InnerException?.Data["MessageText"]);
                Console.WriteLine("Error occured in the entity of " + ex.InnerException?.Data["TableName"]);
            }
        }
    }
}