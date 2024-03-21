namespace Server.ViewModels;

public class ListingDetailsViewModel()
{
    public string? Heading { get; set; }
    public string? CopyWriting { get; set; }
    public int BedNumber { get; set; }
    public int BathNumber { get; set; }
    public int GarageNumber { get; set; }
    public DateTime AuctionDateTime { get; set; }
    public string? Address { get; set; }
    public string? PropertyType { get; set; }
    public IEnumerable<AgentViewModel>? Agents { get; set; }

    public AgencyViewModel? Agency { get; set; }
    public AuctioneerViewModel? Auctioneer { get; set; }
    public List<byte[]>? PhotosBytes { get; set;}

    public List<DocumentViewModel>? Documents {get;set;}
}