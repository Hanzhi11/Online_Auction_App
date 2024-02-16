using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Server.Models;

namespace Server.Data;

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
            if (!canConnect)
            {
                context.Database.EnsureCreated();
            } 
   
            if (context.HasData())
            {
                return;
            }

            context.PropertyType.AddRange(
                new("house"),
                new("townhouse"),
                new("unit"),
                new("land")
            );


            Role agent = new("agent");
            Role auctioneer = new("auctioneer");

            context.Role.AddRange(
                agent,
                auctioneer
            );

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
                new Address("6", "Hehua Street", "Wanhuayuan Hehuayuan", "4109"),
                new Address("1", "Agency Street", "Zhongjie Gongsi", "4116"),
                new Address("2", "Agency Street", "Zhongjie Gongsi", "4116")
            );

            Guid agentId = agent.Id;
            Guid auctioneerId = auctioneer.Id;

            Person person1 = new("May", "May");
            Person person2 = new("David", "David");
            Person person3 = new("Joe", "Joe");
            Person person4 = new("June", "June");

            context.Person.AddRange(
                person1,
                person2,
                person3,
                person4
            );

            context.SaveChanges();

            List<Address> agencyAddresses = [.. context.Address.Where(a => a.Street == "Agency Street")];
            List<Agency> agencies = agencyAddresses.Select(a => new Agency("Bid Now " + a.StreetNumber + " Agency", a.Id)).ToList();
            context.Agency.AddRange(agencies);

            List<Person> persons = [.. context.Person];
            PersonRole personRole1 = new()
            {
                PersonId = context.Person.FirstOrDefault(p => p.FirstName == person1.FirstName)!.Id,
                RoleId = agentId,
                Mobile = "0412341234",
                Email = person1.FirstName + person1.LastName + "@bidnow.com.au",
                Agency = agencies[0]
            };
            PersonRole personRole2 = new()
            {
                PersonId = context.Person.FirstOrDefault(p => p.FirstName == person2.FirstName)!.Id,
                RoleId = agentId,
                Mobile = "0443214321",
                Email = person2.FirstName + person2.LastName + "@bidnow.com.au",
                Agency = agencies[1]
            };
            PersonRole personRole3 = new()
            {
                PersonId = context.Person.FirstOrDefault(p => p.FirstName == person3.FirstName)!.Id,
                RoleId = auctioneerId,
                LicenceNumber = "12345678"
            };
            PersonRole personRole4 = new()
            {
                PersonId = context.Person.FirstOrDefault(p => p.FirstName == person4.FirstName)!.Id,
                RoleId = auctioneerId,
                LicenceNumber = "87654321"
            };
            context.PersonRole.AddRange(
                personRole1,
                personRole2,
                personRole3,
                personRole4
            );

            context.SaveChanges();

            Guid addressId = context.Address.FirstOrDefault()!.Id;
            Guid propertyTypeId = context.PropertyType.FirstOrDefault()!.Id;

            Guid personAuctioneerId = context.PersonRole
            .Include(pr => pr.Person)
            .Include(pr => pr.Role)
            .FirstOrDefault(pr => pr.Role!.Name == "auctioneer")!.Id;
            DateTime auctionDateTime = DateTime.SpecifyKind(new DateTime(2024, 3, 23, 14, 30, 0), DateTimeKind.Utc);

            context.Listing.Add(new("", "", auctionDateTime, addressId, propertyTypeId, agencies[0].Id, personAuctioneerId));
            context.SaveChanges();

            Guid listingId = context.Listing.FirstOrDefault()!.Id;
            Guid personAgentId = context.PersonRole
                .Include(pr => pr.Person)
                .Include(pr => pr.Role)
                .FirstOrDefault(pr => pr.Role!.Name == "agent")!.Id;
            ListingAgent listingAgent = new(listingId, personAgentId);
            context.ListingAgent.Add(listingAgent);
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
            if (ex is ValidationException)
            {
                Console.WriteLine("Error Message is " + ex.Message);
            }
        }
    }
}