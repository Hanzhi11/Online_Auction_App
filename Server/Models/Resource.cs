using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models;

[Index(nameof(Location), IsUnique = true)]
public class Resource(string name, string location)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string Name {get;set;} = name;
    public string Location {get;set;} = location;
}