using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Models;
using Server.ViewModels;

namespace Server.Controllers;

public class AddressController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    public IActionResult Index()
    {
        List<Address> addresses = [.. _context.Address];
        List<FullAddressViewModel> fullAddresses = [];
        foreach (Address address in addresses)
        {
            State state = _context.State.FirstOrDefault(s => s.PostCode == address.StatePostCode)!;
            string stateName = state.Name;

            FullAddressViewModel fulladdress = new()
            {
                UnitNumber = address.UnitNumber,
                StreetNumber = address.StreetNumber,
                Street = address.Street,
                Suburb = address.Suburb,
                PostCode = address.StatePostCode,
                State = stateName
            };
            fullAddresses.Add(fulladdress);
        }

        return Ok(fullAddresses);
    }
}
