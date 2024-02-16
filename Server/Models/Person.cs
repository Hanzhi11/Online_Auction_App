using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Person
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public Person(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    // public ICollection<PersonRole>? PersonRoles {get;set;}
}