namespace Server.Data;

public enum Role
{
    Agent,
    Auctioneer
}

public enum PropertyType
{
    House,
    Townhouse,
    Unit,
    Land
}

public enum ResourceType
{
    Document,
    Photo,
}
public enum DocumentType
{
    Bidders_Guide,
    REIQ_Auction_Conditions,
    Building_And_Pest_Inspection_Report,
}

public static class SharedDictionary
{
    public static Dictionary<string, string> StateName { get; } = new Dictionary<string, string>()
{
    { "All_State", "ALL" },
    { "Australian_Capital_Territory", "ACT" },
    { "New_South_Wales", "NSW" },
    { "Queensland", "QLD" },
    { "South_Australia", "SA" },
    { "Tasmania", "TAS" },
    { "Victoria", "VIC" },
    { "Western_Australia", "WA" },
    { "Northern_Territory", "NT" },
};
}

