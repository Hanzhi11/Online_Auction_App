using System.ComponentModel.DataAnnotations.Schema;
using Server.ViewModels;
using Server.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

[Index(nameof(ListingNumber), IsUnique = true)]
public class Listing(
    string heading,
    string copyWriting,
    int bedNumber,
    int bathNumber,
    int garageNumber,
    DateTime auctionDateTime,
    Guid addressId,
    PropertyType propertyType,
    Guid agencyId,
    Guid auctioneerId
    )
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public int ListingNumber { get; set; }

    public string Heading { get; set; } = heading;
    public string CopyWriting { get; set; } = copyWriting;

    [CustomValidation(typeof(Listing), nameof(ValidateNumber))]
    public int BedNumber { get; set; } = bedNumber;
    [CustomValidation(typeof(Listing), nameof(ValidateNumber))]
    public int BathNumber { get; set; } = bathNumber;
    [CustomValidation(typeof(Listing), nameof(ValidateNumber))]
    public int GarageNumber { get; set; } = garageNumber;
    public DateTime DateTimeCreated { get; set; } = DateTime.UtcNow;

    public DateTime AuctionDateTime { get; set; } = auctionDateTime;

    public Guid AddressId { get; set; } = addressId;
    public Address? Address { get; set; }

    public PropertyType PropertyType { get; set; } = propertyType;

    public ICollection<ListingAgent>? ListingAgents { get; set; }

    public Guid AgencyId { get; set; } = agencyId;
    public Agency? Agency { get; set; }

    public Guid AuctioneerId { get; set; } = auctioneerId;
    public Auctioneer? Auctioneer { get; set; }

    public ICollection<Photo>? Photos { get; }

    public ICollection<ListingDocument>? ListingDocuments { get; }

    public ICollection<Enquiry>? Enquiries { get; }

    public static ValidationResult ValidateNumber(int value, ValidationContext validationContext)
    {
        if (validationContext.ObjectInstance is Listing instance && instance.PropertyType == PropertyType.Land && value > 0)
        {
            return new ValidationResult("Land must have 0 bed room, 0 bath room and 0 garage.");
        }

        return ValidationResult.Success!;
    }

    public ListingInfoViewModel GetInformation()
    {
        string agencyName = "";
        if (Agency is not null)
        {
            agencyName = Agency.Name;
        }
        string dataUrl = "";
        byte[] photoBytes = Photos!.OrderBy(p => p.DateTimeCreated).FirstOrDefault()!.Bytes;
        if (photoBytes != null)
        {
            string base64String = Convert.ToBase64String(photoBytes);
            dataUrl = $"data:image/jpeg;base64,{base64String}";
        }
        ListingInfoViewModel information = new(
            Address!.FormatToFullAddress(),
            AuctionDateTime,
            agencyName,
            ListingNumber,
            dataUrl
            );
        return information;
    }

    public ListingDetailsViewModel GetDetails()
    {
        List<AgentViewModel> agents = [];
        if (ListingAgents!.Count != 0)
        {
            foreach (ListingAgent listingAgent in ListingAgents)
            {
                AgentViewModel agent = new()
                {
                    FullName = listingAgent.Agent!.FirstName + " " + listingAgent.Agent.LastName,
                    Email = listingAgent.Agent.Email,
                    Mobile = listingAgent.Agent.Mobile,
                    PortraitBytes = listingAgent.Agent.PortraitBytes
                };
                agents.Add(agent);
            }
        }

        AuctioneerViewModel auctioneer = new();
        if (Auctioneer != null)
        {
            auctioneer.FullName = Auctioneer.FirstName + " " + Auctioneer.LastName;
            auctioneer.LicenceNumber = Auctioneer.LicenceNumber;
            auctioneer.PortraitBytes = Auctioneer.PortraitBytes;
        }

        AgencyViewModel agency = new();

        if (Agency != null)
        {
            agency.Name = Agency.Name;
            agency.Address = Agency.Address!.FormatToFullAddress();
        };

        List<byte[]> photosBytes = [];
        if (Photos!.Count != 0)
        {
            photosBytes = Photos!.OrderBy(p => p.DateTimeCreated).Select(p => p.Bytes).ToList();
        }

        List<DocumentViewModel> documents = [];
        if (ListingDocuments!.Count != 0)
        {
            foreach (ListingDocument ListingDocument in ListingDocuments)
            {
                string[] locationStrings = ListingDocument.Resource!.Location.Split('/');
                string location = "";
                if (locationStrings.Length == 4)
                {
                    location = locationStrings[2] + "/" + locationStrings[3];
                }
                else
                {
                    location = locationStrings[3] + "/" + locationStrings[4];
                }
                DocumentViewModel document = new(ListingDocument.Resource!.DocumentType, location);
                documents.Add(document);
            }
        }

        ListingDetailsViewModel details = new()
        {
            Heading = Heading,
            CopyWriting = CopyWriting,
            BedNumber = BedNumber,
            BathNumber = BathNumber,
            GarageNumber = GarageNumber,
            AuctionDateTime = AuctionDateTime,
            Address = Address!.FormatToFullAddress(),
            PropertyType = PropertyType.ToString(),
            Agents = agents,
            Agency = agency,
            Auctioneer = auctioneer,
            PhotosBytes = photosBytes,
            Documents = documents
        };

        return details;
    }
}