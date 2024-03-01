namespace Server.ViewModels;

public class ListingInfoViewModel(string address, DateTime auctionDateTime, string agencyName, int listingNumber, string photoDataURL)
{
    public string Address { get; set; } = address;
    public DateTime AuctionDateTime { get; set; } = auctionDateTime;
    public string AgencyName { get; set; } = agencyName;
    public int ListingNumber {get;set;} = listingNumber;

    public string PhotoDataURL { get; set; } = photoDataURL;
}
