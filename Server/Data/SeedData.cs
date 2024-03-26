using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Server.Models;

namespace Server.Data;

public static class SeedData
{
    public static async void Initialze(IServiceProvider serviceProvider, IWebHostEnvironment env)
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
            string postCode4 = postCodes[3];

            Address agencyAddress1 = new("1", "Agency Avenue", "Zhongjie Gongsi", postCode3);
            Address agencyAddress2 = new("2", "Agency Avenue", "Zhongjie Gongsi", postCode3);

            Address houseAddress1 = new("28", "Meihua Street", "Wanhuayuan Meihuayuan District", postCode1);
            Address houseAddress2 = new("15", "Meihua Street", "Wanhuayuan Meihuayuan District", postCode1);

            Address houseAddress3 = new("15", "Hehua Street", "Wanhuayuan Hehuayuan", postCode4);
            Address houseAddress4 = new("5", "Hehua Street", "Wanhuayuan Hehuayuan", postCode4);

            Address landAddress1 = new("6", "Huaihua Street", "Wanhuayuan Huaihuayuan", postCode2);
            
            Address townhouseAddress1 = new("14", "Hehua Street", "Wanhuayuan Hehuayuan", postCode4)
            {
                UnitNumber = "1"
            };
            Address townhouseAddress2 = new("14", "Hehua Street", "Wanhuayuan Hehuayuan", postCode4)
            {
                UnitNumber = "2"
            };
            Address unitAddress1 = new("24", "Meihua Street", "Wanhuayuan Meihuayuan District", postCode1)
            {
                UnitNumber = "301"
            };
            Address unitAddress2 = new("24", "Meihua Street", "Wanhuayuan Meihuayuan District", postCode1)
            {
                UnitNumber = "102"
            };


            context.Address.AddRange(
                houseAddress1,
                houseAddress2,
                houseAddress3,
                houseAddress4,
                landAddress1,
                townhouseAddress1,
                townhouseAddress2,
                unitAddress1,
                unitAddress2,
                agencyAddress1,
                agencyAddress2
            );

            Agency agency1 = new("Bid Now " + agencyAddress1.StreetNumber + " Agency", agencyAddress1.Id);
            Agency agency2 = new("Bid Now " + agencyAddress2.StreetNumber + " Agency", agencyAddress2.Id);
            context.Agency.AddRange(agency1, agency2);

            string portrait1 = "Data/Assets/portrait1.jpeg";
            string portrait2 = "Data/Assets/portrait2.jpeg";
            string portrait3 = "Data/Assets/portrait3.jpeg";
            string portrait4 = "Data/Assets/portrait4.jpeg";
            string[] photoPaths = [portrait1, portrait2, portrait3, portrait4];
            List<byte[]> portraits = [];
            foreach (string photoPath in photoPaths)
            {
                byte[] photoBytes;
                string fileName = Path.GetFileNameWithoutExtension(photoPath);
                using (FileStream fileStream = new(photoPath, FileMode.Open, FileAccess.Read))
                {
                    photoBytes = new byte[fileStream.Length];
                    fileStream.Read(photoBytes, 0, (int)fileStream.Length);
                }
                portraits.Add(photoBytes);
            }

            Agent agent1 = new("May")
            {
                LastName = "May",
                Mobile = "0412341234",
                Email = "MayMay@bidnow.com.au",
                Agency = agency1,
                PortraitBytes = portraits[0]
            };
            Agent agent2 = new("David")
            {
                LastName = "David",
                Mobile = "0443214321",
                Email = "DavidDavid@bidnow.com.au",
                Agency = agency2,
                PortraitBytes = portraits[1]
            };
            Agent agent3 = new("Sammy")
            {
                LastName = "Agent",
                Mobile = "0499999999",
                Email = "SammyAgent@bidnow.com.au",
                Agency = agency1
            };
            Auctioneer auctioneer1 = new("Joe")
            {
                LastName = "Joe",
                LicenceNumber = "12345678",
                PortraitBytes = portraits[3]
            };
            Auctioneer auctioneer2 = new("June")
            {
                LastName = "June",
                LicenceNumber = "87654321",
                PortraitBytes = portraits[2]
            };

            context.Agent.AddRange(
                agent1,
                agent2,
                agent3
            );
            context.Auctioneer.AddRange(
                auctioneer1,
                auctioneer2
            );

            DateTime auctionDateTime1 = DateTime.SpecifyKind(new DateTime(2024, 3, 23, 14, 30, 0), DateTimeKind.Local).ToUniversalTime();
            string heading1 = "Exquisite Luxury Awaits: Discover Your Dream Two-Storey Home Today!";
            string copyWriting1 = "Nestled in the heart of Wanhuayuan Hehuayuan, this magnificent two-storey luxury residence epitomizes grandeur and sophistication. Boasting meticulous craftsmanship and timeless design, every corner of this opulent abode exudes luxury.";

            Listing listing1 = new(
                heading1,
                copyWriting1,
                4,
                3,
                2,
                auctionDateTime1,
                houseAddress1.Id,
                PropertyType.House,
                agency1.Id,
                auctioneer1.Id
                )
            {
                ListingNumber = 1
            };

            DateTime auctionDateTime2 = DateTime.SpecifyKind(new DateTime(2024, 4, 27, 10, 30, 0), DateTimeKind.Local).ToUniversalTime();
            string heading2 = "Stunning Townhouse for Sale: Modern Living in a Prime Location";
            string copyWriting2 = File.ReadAllText("public/copyWriting2.txt");

            Listing listing2 = new(
                heading2,
                copyWriting2,
                3,
                2,
                2,
                auctionDateTime2,
                townhouseAddress1.Id,
                PropertyType.Townhouse,
                agency2.Id,
                auctioneer2.Id
                )
            {
                ListingNumber = 2
            };

            DateTime auctionDateTime3 = DateTime.SpecifyKind(new DateTime(2024, 4, 27, 15, 30, 0), DateTimeKind.Local).ToUniversalTime();
            string heading3 = "Modern Luxury Awaits: Spectacular Apartment for Sale in the Heart of the City";
            string copyWriting3 = File.ReadAllText("public/copyWriting3.txt");

            Listing listing3 = new(
                heading3,
                copyWriting3,
                3,
                2,
                1,
                auctionDateTime3,
                unitAddress1.Id,
                PropertyType.Unit,
                agency1.Id,
                auctioneer1.Id
                )
            {
                ListingNumber = 3
            };

            DateTime auctionDateTime4 = DateTime.SpecifyKind(new DateTime(2024, 4, 27, 9, 30, 0), DateTimeKind.Local).ToUniversalTime();
            string heading4 = "Build Your Dream Home: Prime Block of Land for Sale in a Desirable Location";
            string copyWriting4 = "";

            Listing listing4 = new(
                heading4,
                copyWriting4,
                0,
                0,
                0,
                auctionDateTime4,
                landAddress1.Id,
                PropertyType.Land,
                agency1.Id,
                auctioneer1.Id
                )
            {
                ListingNumber = 4
            };

            context.Listing.AddRange(listing1, listing2, listing3, listing4);

            ListingAgent listingAgent1 = new(listing1.Id, agent1.Id);
            ListingAgent listingAgent2 = new(listing1.Id, agent3.Id);
            ListingAgent listingAgent3 = new(listing2.Id, agent2.Id);
            ListingAgent listingAgent4 = new(listing3.Id, agent1.Id);
            ListingAgent listingAgent5 = new(listing4.Id, agent2.Id);
            context.ListingAgent.AddRange(listingAgent1, listingAgent2, listingAgent3, listingAgent4, listingAgent5);

            ImageDownloader imageDownloader = new ImageDownloader();
            byte[][] imageBytesArray = await imageDownloader.DownloadImagesAsync(HouseOutURLs.Concat(HouseInURLs));

            for (int i = 0; i < imageBytesArray.Length; i++)
            {
                if (imageBytesArray[i] != null)
                {
                    string name = $"house{i + 1}";
                    Photo photo = new(name, imageBytesArray[i])
                    {
                        Listing = listing1
                    };
                    context.Photo.Add(photo);
                }
                else
                {
                    Console.WriteLine($"Failed to download house image {i + 1}.");
                }
            }
            byte[][] imageBytesArray2 = await imageDownloader.DownloadImagesAsync(TownHouseOutURLs.Concat(TownHouseInURLs));

            for (int i = 0; i < imageBytesArray2.Length; i++)
            {
                if (imageBytesArray2[i] != null)
                {
                    string name = $"townHouse{i + 1}";
                    Photo photo = new(name, imageBytesArray2[i])
                    {
                        Listing = listing2
                    };
                    context.Photo.Add(photo);
                }
                else
                {
                    Console.WriteLine($"Failed to download town house image {i + 1}.");
                }
            }
            byte[][] imageBytesArray3 = await imageDownloader.DownloadImagesAsync(UnitOutURLs.Concat(UnitInURLs));

            for (int i = 0; i < imageBytesArray3.Length; i++)
            {
                if (imageBytesArray3[i] != null)
                {
                    string name = $"unit{i + 1}";
                    Photo photo = new(name, imageBytesArray3[i])
                    {
                        Listing = listing3
                    };
                    context.Photo.Add(photo);
                }
                else
                {
                    Console.WriteLine($"Failed to download unit image {i + 1}.");
                }
            }
            byte[][] imageBytesArray4 = await imageDownloader.DownloadImagesAsync(LandURLs);

            for (int i = 0; i < imageBytesArray4.Length; i++)
            {
                if (imageBytesArray4[i] != null)
                {
                    string name = $"land{i + 1}";
                    Photo photo = new(name, imageBytesArray4[i])
                    {
                        Listing = listing4
                    };
                    context.Photo.Add(photo);
                }
                else
                {
                    Console.WriteLine($"Failed to download land image {i + 1}.");
                }
            }

            Document document1 = new("auction conditions", "listing/document/shared/QLD/REIQ_Auction_Conditions.pdf", DocumentType.REIQ_Auction_Conditions);
            Document document2 = new("inspection reports", "listing/document/1/Building_And_Pest_Inspection_Report.pdf", DocumentType.Building_And_Pest_Inspection_Report);
            context.Document.AddRange(
                document1,
                document2
            );
            ListingDocument listingDocument1 = new(listing1.Id, document1.Id);
            ListingDocument listingDocument2 = new(listing1.Id, document2.Id);
            context.ListingDocument.AddRange(listingDocument1, listingDocument2);

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

    private static readonly IEnumerable<string> HouseOutURLs =
    [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];
    private static readonly IEnumerable<string> HouseInURLs =
    [
        "https://plus.unsplash.com/premium_photo-1661962841993-99a07c27c9f4?w=1750&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2V8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1750&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG91c2V8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1750&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGhvdXNlfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1629079448081-c6ab9cbea877?w=1750&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRvd25ob3VzZXxlbnwwfHwwfHx8MA%3D%3D"
    ];
    private static readonly IEnumerable<string> TownHouseOutURLs =
    [
        "https://images.unsplash.com/photo-1625283518755-6047df2fb180?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];
    private static readonly IEnumerable<string> TownHouseInURLs =
    [
        "https://plus.unsplash.com/premium_photo-1674815329488-c4fc6bf4ced8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];
    private static readonly IEnumerable<string> UnitOutURLs =
    [
        "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];
    private static readonly IEnumerable<string> UnitInURLs =
    [
        "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=1258&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];
    private static readonly IEnumerable<string> LandURLs =
    [
        "https://plus.unsplash.com/premium_photo-1663133686323-5a078d8d3fa7?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];
}