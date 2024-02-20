using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Server.Models;

namespace Server.Data;

public static class SeedData
{
    public static void Initialze(IServiceProvider serviceProvider, IWebHostEnvironment env)
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

            bool hasCustomData = context.HasCustomData();
            bool shouldTruncateTables = env.IsDevelopment();

            if (!shouldTruncateTables)
            {
                return;
            }

            if (hasCustomData)
            {
                context.TruncateTables();
            }

            List<State> states = [.. context.State];
            List<string> postCodes = [.. context.State.Select(s => s.PostCode)];
            string postCode1 = postCodes[0];
            string postCode2 = postCodes[1];
            string postCode3 = postCodes[2];

            context.Address.AddRange(
                new Address("28", "Meihua Street", "Wanhuayuan Meihuayuan District", postCode1),
                new Address("14", "Meihua Street", "Wanhuayuan Meihuayuan District", postCode1)
                {
                    UnitNumber = "1"

                },
                new Address("14", "Meihua Street", "Wanhuayuan Meihuayuan District", postCode1)
                {
                    UnitNumber = "2"
                },
                new Address("14", "Meihua Street", "Wanhuayuan Meihuayuan District", postCode1)
                {
                    UnitNumber = "3"
                },
                new Address("14", "Meihua Street", "Wanhuayuan Meihuayuan District", postCode1)
                {
                    UnitNumber = "4"
                },
                new Address("15", "Meihua Street", "Wanhuayuan Meihuayuan District", postCode1),
                new Address("15", "Hehua Street", "Wanhuayuan Hehuayuan", postCode2),
                new Address("5", "Hehua Street", "Wanhuayuan Hehuayuan", postCode2),
                new Address("6", "Hehua Street", "Wanhuayuan Hehuayuan", postCode2),
                new Address("1", "Agency Avenue", "Zhongjie Gongsi", postCode3),
                new Address("2", "Agency Avenue", "Zhongjie Gongsi", postCode3)
            );

            context.SaveChanges();

            List<Address> agencyAddresses = [.. context.Address.Where(a => a.Street == "Agency Avenue")];
            List<Agency> agencies = agencyAddresses.Select(a => new Agency("Bid Now " + a.StreetNumber + " Agency", a.Id)).ToList();
            context.Agency.AddRange(agencies);

            Role agent = Role.Agent;
            Role auctioneer = Role.Auctioneer;

            Person person1 = new("May", "May")
            {
                Role = agent,
                Mobile = "0412341234",
                Email = "MayMay@bidnow.com.au",
                Agency = agencies[0]
            };
            Person person2 = new("David", "David")
            {
                Role = agent,
                Mobile = "0443214321",
                Email = "DavidDavid@bidnow.com.au",
                Agency = agencies[1]
            };
            Person person3 = new("Joe", "Joe")
            {
                Role = auctioneer,
                LicenceNumber = "12345678"
            };
            Person person4 = new("June", "June")
            {
                Role = auctioneer,
                LicenceNumber = "87654321"
            };

            context.Person.AddRange(
                person1,
                person2,
                person3,
                person4
            );

            context.SaveChanges();

            Guid addressId = context.Address.FirstOrDefault()!.Id;

            Guid auctioneerId = context.Person
            .FirstOrDefault(pr => pr.Role == Role.Auctioneer)!.Id;
            DateTime auctionDateTime = DateTime.SpecifyKind(new DateTime(2024, 3, 23, 14, 30, 0), DateTimeKind.Local).ToUniversalTime();

            // ICollection<Photo> photos = [..context.Photo];
            Listing listing = new("", "", auctionDateTime, addressId, PropertyType.House, agencies[0].Id, auctioneerId);
            context.Listing.Add(listing);
            context.SaveChanges();

            Guid listingId = context.Listing.FirstOrDefault()!.Id;
            Guid agentId = context.Person
                .FirstOrDefault(pr => pr.Role == Role.Agent)!.Id;
            ListingAgent listingAgent = new(listingId, agentId);
            context.ListingAgent.Add(listingAgent);
            context.SaveChanges();

            string photoPath1 = "/Users/hanzhizhang/Desktop/BidNow/UI/public/h1.jpeg";
            string photoPath2 = "/Users/hanzhizhang/Desktop/BidNow/UI/public/th1.jpeg";
            string[] photoPaths = [photoPath1, photoPath2];
            foreach (string photoPath in photoPaths)
            {
                byte[] photoBytes;
                string fileName = Path.GetFileNameWithoutExtension(photoPath);
                using (FileStream fileStream = new(photoPath, FileMode.Open, FileAccess.Read))
                {
                    photoBytes = new byte[fileStream.Length];
                    fileStream.Read(photoBytes, 0, (int)fileStream.Length);
                }

                Photo photo = new (fileName, photoBytes)
                {
                    Listing = context.Listing.FirstOrDefault()
                };
                context.Photo.Add(photo);
            }
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