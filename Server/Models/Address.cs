using System.ComponentModel.DataAnnotations.Schema;
using Server.ViewModels;

namespace Server.Models;

public class Address(string streetNumber, string street, string suburb, string statePostCode)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string UnitNumber { get; set; } = "";
    public string StreetNumber { get; set; } = streetNumber;
    public string Street { get; set; } = street;
    public string Suburb { get; set; } = suburb;
    public string StatePostCode { get; set; } = statePostCode;

    public State? State { get; set; }

    public FullAddressViewModel FormatToFullAddress()
    {
        FullAddressViewModel fullAddress = new();

        if (State != null)
        {
            fullAddress.UnitNumber = UnitNumber;
            fullAddress.StreetNumber = StreetNumber;
            fullAddress.Street = Street;
            fullAddress.Suburb = Suburb;
            fullAddress.PostCode = StatePostCode;
            fullAddress.State = State.Name;
        }

        return fullAddress;
    }
}