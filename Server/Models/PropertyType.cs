using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class PropertyType(string id)
{
    // public Guid Id { get; set; } = Guid.NewGuid();

    [Key]
    public string Id { get; set; } = id;

}