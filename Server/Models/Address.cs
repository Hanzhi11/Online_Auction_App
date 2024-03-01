using System.ComponentModel.DataAnnotations.Schema;

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

    public string FormatToFullAddress()
    {
        string fullAddress = FormatToFullAddressWithoutState();
        if (State != null)
        {
            fullAddress = fullAddress + ", " +
            State.Name +
            " " +
            StatePostCode;
        }

        return fullAddress;
    }
    
    public string FormatToFullAddressWithoutState()
    {
        string fullAddress = StreetNumber +
            " " +
            Street +
            ", " +
            Suburb;

        if (UnitNumber != "")
        {
            fullAddress = UnitNumber + "/" + fullAddress;
        }

        return fullAddress;
    }
}