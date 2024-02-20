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

    public string Heading { get; set; } = heading;
    public string CopyWriting { get; set; } = copyWriting;
    public DateTime DateTimeCreated { get; set; } = DateTime.UtcNow;

    public DateTime AuctionDateTime { get; set; } = auctionDateTime;

    public Guid AddressId { get; set; } = addressId;
    public Address? Address { get; set; }

    public PropertyType PropertyType { get; set; } = propertyType;

    public ICollection<ListingAgent>? ListingAgents { get; set; }

    public Guid AgencyId {get;set;} = agencyId;
    public Agency? Agency {get;set;}

    public Guid AuctioneerId { get; set; } = auctioneerId;
    public Person? Auctioneer { get; set; }

    public ListingBriefViewModel GetInformation(){
        string agencyName = "";
        if (Agency is not null)
        {
            agencyName = Agency.Name;
        }
        ListingBriefViewModel information = new(
            Address!.FormatToFullAddress(), 
            AuctionDateTime, 
            agencyName
            );
        return information;
    }
}