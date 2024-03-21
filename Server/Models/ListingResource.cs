using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class ListingResource(Guid listingId, Guid ResourceId)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public Guid ListingId { get; set; } = listingId;
    public Listing? Listing { get; set; }
    public Guid ResourceId { get; set; } = ResourceId;
    public Resource? Resource { get; set; }
}