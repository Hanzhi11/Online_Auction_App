using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Data;

namespace Server.Models;

public class Person(string firstName, string lastName)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public string FirstName { get; set; } = firstName;
    public string LastName { get; set; } = lastName;

    [RegularExpression("^04\\d{8}$", ErrorMessage = "Invalid Mobile Number!")]
    public string? Mobile { get; set; }

    [EmailAddress(ErrorMessage = "Invalid Email Address!")]
    public string? Email { get; set; }

    [StringLength(8, MinimumLength = 8)]
    public string? LicenceNumber { get; set; }

    public Role Role { get; set; }

    public Agency? Agency {get;set;}
}