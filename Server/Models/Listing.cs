using System.ComponentModel.DataAnnotations.Schema;
using Server.ViewModels;
using Server.Data;

namespace Server.Models;

public class Listing(
    string heading,
    string copyWriting,
    DateTime auctionDateTime,
    Guid addressId,
    PropertyType propertyType,
    Guid agencyId,
    Guid auctioneerId
    )
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public int ListingNumber {get;set;}

    public string Heading { get; set; } = heading;
    public string CopyWriting { get; set; } = copyWriting;
    public DateTime DateTimeCreated { get; set; } = DateTime.UtcNow;

    public DateTime AuctionDateTime { get; set; } = auctionDateTime;

    public Guid AddressId { get; set; } = addressId;
    public Address? Address { get; set; }

    public PropertyType PropertyType { get; set; } = propertyType;

    public ICollection<ListingAgent>? ListingAgents { get; set; }

    public Guid AgencyId { get; set; } = agencyId;
    public Agency? Agency { get; set; }

    public Guid AuctioneerId { get; set; } = auctioneerId;
    public Person? Auctioneer { get; set; }

    public ICollection<Photo>? Photos { get; }

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
}