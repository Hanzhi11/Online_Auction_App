using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class State(string postCode, string name)
{
    [Key]
    public string PostCode { get; set; } = postCode;

    public string Name { get; set; } = name;

    // public ICollection<Address>? Addresses { get; }
}