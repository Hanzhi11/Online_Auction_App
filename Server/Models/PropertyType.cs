namespace Server.Model;

public class PropertyType(string type)
{
    public Guid Id {get;set;} = Guid.NewGuid();

    public string Type {get;set;} = type;
}