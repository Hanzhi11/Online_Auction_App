namespace Server.Models;

public class ListingDocument(Guid listingId, Guid documentId) : ListingResource(listingId)
{
    public Guid DocumentId { get; set; } = documentId;
    public Document? Document { get; set; }

}