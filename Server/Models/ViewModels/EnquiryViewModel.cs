namespace Server.Models;

public class EnquiryViewModel(List<string> subject, string name, string email, string contactNumber){
    public List<string> Subject {get;set;} = subject;
    public string? Message {get;set;}
    public string Name {get;set;} = name;
    public string Email {get;set;} = email;
    public string ContactNumber {get;set;} = contactNumber;

}