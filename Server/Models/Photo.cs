using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Photo(string name, byte[] bytes)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string Name {get;set;} = name;
    public byte[] Bytes {get;set;} = bytes;
    public DateTime DateTimeCreated { get; set; } = DateTime.UtcNow;

    public Guid? ListingId {get;set;}
    public Listing? Listing {get;set;}
}