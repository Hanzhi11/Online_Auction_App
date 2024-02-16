using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Server.Models;

public class ListingAgent(Guid listingId, Guid personAgentId)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public Guid ListingId { get; set; } = listingId;
    public Listing? Listing { get; set; }
    public Guid PersonAgentId { get; set; } = personAgentId;
    public PersonRole? PersonAgent { get; set; }
}