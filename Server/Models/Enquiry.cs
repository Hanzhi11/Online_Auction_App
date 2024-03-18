using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public enum Subject
{
    BookInspection,
    ContractOfSale,
    RatesAndFees,
    FurtherInformation
}

public class Enquiry(List<Subject> subjects, string message, string name, string email, string contactNumber, Guid listingId)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public List<Subject> Subjects { get; set; } = subjects;
    public string Message { get; set; } = message;
    public string Name { get; set; } = name;
    public string Email { get; set; } = email;
    public string ContactNumber { get; set; } = contactNumber;

    public Guid ListingId {get;set;} = listingId;
    public Listing? Listing {get;set;}
}