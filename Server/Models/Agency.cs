using System.ComponentModel.DataAnnotations.Schema;
using Server.Models;

namespace Server.Model;

public class Agency(string name, Guid addressId )
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public string Name {get; set;} = name;
    public Guid AddressId {get; set;} = addressId;

    public Address? Address;
}