using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Agency(string name, Guid addressId )
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public string Name {get; set;} = name;
    public Guid AddressId {get; set;} = addressId;

    public Address? Address {get; set;}
    public ICollection<Agent>? Agents {get;}
    public ICollection<Listing>? Listings {get;}
}