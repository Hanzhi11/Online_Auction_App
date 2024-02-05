using Microsoft.EntityFrameworkCore;
using Server.Data;

namespace Server.Models;

public static class SeedData
{
    public static void Initialze(IServiceProvider serviceProvider)
    {
        using var context = new AppDbContext(
            serviceProvider.GetRequiredService<
            DbContextOptions<AppDbContext>>());

        if (context.State.Any())
        {
            context.Database.ExecuteSqlRaw("TRUNCATE TABLE \"State\"");
        }
        context.State.AddRange(
            new State("4113", "QLD"),
            new State("4109", "QLD"),
            new State("4122", "QLD")
        );
        context.SaveChanges();
    }
}