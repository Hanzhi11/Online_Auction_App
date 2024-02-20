using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Role(string id)
{    
    [Key]
    public string Id {get;set;} = id; 
}