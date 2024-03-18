using System.ComponentModel.DataAnnotations;
using Server.Data;

namespace Server.Models;

public class Auctioneer(string firstName) : Person(firstName)
{
    public byte[]? PortraitBytes { get; set; }

    [StringLength(8, MinimumLength = 8)]
    public string? LicenceNumber { get; set; }
    public Role Role { get; } = Role.Auctioneer;
}