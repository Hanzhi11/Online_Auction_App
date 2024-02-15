namespace Server.Model;

public class Role(string name)
{
    public Guid Id {get;set;} = Guid.NewGuid();

    public string Name {get;set;} = name;

    public ICollection<PersonRole>? PersonRoles {get;set;}
 
}