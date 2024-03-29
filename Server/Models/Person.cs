using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Person(string firstName)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public string FirstName { get; set; } = firstName;
    public string? LastName { get; set; }
}