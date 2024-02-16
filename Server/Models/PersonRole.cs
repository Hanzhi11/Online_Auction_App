using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class PersonRole
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [RegularExpression("^04\\d{8}$", ErrorMessage = "Invalid Mobile Number!")]
    public string? Mobile { get; set; }

    [EmailAddress(ErrorMessage = "Invalid Email Address!")]
    public string? Email { get; set; }

    [StringLength(8, MinimumLength = 8)]
    public string? LicenceNumber { get; set; }

    public Guid PersonId { get; set; }
    public Person? Person { get; set; }
    public Guid RoleId { get; set; }
    public Role? Role { get; set; }

    public Agency? Agency {get;set;}
}