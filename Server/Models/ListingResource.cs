using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class ListingResource(Guid listingId)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public Guid ListingId { get; set; } = listingId;
    public Listing? Listing { get; set; }
}