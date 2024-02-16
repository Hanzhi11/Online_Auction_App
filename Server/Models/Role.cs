namespace Server.Models;

public class Role(string name)
{
    public Guid Id {get;set;} = Guid.NewGuid();

    public string Name {get;set;} = name; 
}