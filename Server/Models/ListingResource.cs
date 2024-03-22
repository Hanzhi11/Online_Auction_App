using Server.Models;

namespace Server.Interfaces;

public interface IListingResource<T>
{
    Guid Id { get; set; }

    Guid ListingId { get; set; }
    Listing? Listing { get; set; }
    Guid ResourceId { get; set; }
    T? Resource { get; set; }
}