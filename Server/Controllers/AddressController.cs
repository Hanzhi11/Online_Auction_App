using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.ViewModels;

namespace Server.Controllers;

public class AddressController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    public IActionResult Index()
    {
        List<Address> addresses = _context.Address.Include(a => a.State).ToList();
        List<FullAddressViewModel> fullAddresses = [];

        foreach (Address address in addresses)
        {
            FullAddressViewModel fullAddress = address.FormatToFullAddress();
            fullAddresses.Add(fullAddress);
        }

        return Ok(fullAddresses);
    }
}
