
using Server.Data;

namespace Server.ViewModels;

public class DocumentViewModel(ResourceType documentType, string location) {
    public ResourceType DocumentType {get;set;} = documentType;
    public string Location {get;set;} = location;
}