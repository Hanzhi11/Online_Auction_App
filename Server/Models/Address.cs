using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Server.Models;

[method: SetsRequiredMembers]
public class Address(string streetNumber, string street, string suburb, string statePostCode)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string UnitNumber {get; set;} = "";
    public string StreetNumber {get; set;} = streetNumber;
    public string Street {get; set;} = street;
    public string Suburb {get; set;} = suburb;
    public string StatePostCode {get; set;} = statePostCode;

    public State? State { get; set;}
}