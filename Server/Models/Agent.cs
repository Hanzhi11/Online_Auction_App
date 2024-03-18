using System.ComponentModel.DataAnnotations;
using Server.Data;

namespace Server.Models;

public class Agent(string firstName) : Person(firstName)
{
    [RegularExpression("^04\\d{8}$", ErrorMessage = "Invalid Mobile Number!")]
    public string? Mobile { get; set; }

    [EmailAddress(ErrorMessage = "Invalid Email Address!")]
    public string? Email { get; set; }

    public byte[]? PortraitBytes { get; set; }

    public Role Role { get; } = Role.Agent;
    
    public Agency? Agency { get; set; }
}