using Server.Data;

namespace Server.Models;

public class Document(string name, string location, DocumentType documentType) : Resource(name, location)
{
    public DocumentType DocumentType {get;set;} = documentType;
}