using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Server.Models;

[method: SetsRequiredMembers]
public class State(string postCode, string name)
{
    [Key]
    public string PostCode { get; set; } = postCode;

    public string Name { get; set; } = name;

    // public ICollection<Address>? Addresses { get; }
}