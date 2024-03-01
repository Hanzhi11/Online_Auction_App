using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Controllers;

public class AddressController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    public IActionResult Index()
    {
        List<Address> addresses = _context.Address.Include(a => a.State).ToList();
        List<string> fullAddresses = [];

        foreach (Address address in addresses)
        {
            string fullAddress = address.FormatToFullAddress();
            fullAddresses.Add(fullAddress);
        }

        return Ok(fullAddresses);
    }
}
