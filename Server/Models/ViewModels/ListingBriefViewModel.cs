namespace Server.ViewModels;

public class ListingBriefViewModel(FullAddressViewModel address, DateTime auctionDateTime, string agencyName)
{
    public FullAddressViewModel Address {get; set;} = address;
    public DateTime AuctionDateTime {get;set;} = auctionDateTime;
    public string AgencyName {get;set;} = agencyName;
}
