
using Server.Data;

namespace Server.ViewModels;

public class DocumentViewModel(DocumentType documentType, string location) {
    public string DocumentType {get;set;} = documentType.ToString();
    public string Location {get;set;} = location;
}