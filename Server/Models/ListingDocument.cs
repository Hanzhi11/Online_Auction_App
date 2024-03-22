using System.ComponentModel.DataAnnotations.Schema;
using Server.Interfaces;

namespace Server.Models;

public class ListingDocument(Guid listingId, Guid resourceId) : IListingResource<Document>
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public Guid ListingId { get; set; } = listingId;
    public Listing? Listing { get; set; }
    public Guid ResourceId { get; set; } = resourceId;
    public Document? Resource { get; set; }
}