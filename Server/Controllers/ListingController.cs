namespace Server.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.ViewModels;

public class ListingController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    public IActionResult Index()
    {
        List<Listing> listings = [.. _context.Listing];

        return Ok(listings);
    }

    public IActionResult Information()
    {

        List<Listing> listings = [.. _context.Listing
        .Include(l => l.Address)
        .ThenInclude(a => a!.State)
        .Include(l => l.Agency)];

        List<ListingBriefViewModel> listingsInfo = [];
        foreach (Listing listing in listings)
        {
            ListingBriefViewModel info = listing.GetInformation();
            listingsInfo.Add(info);
        }

        return Ok(listingsInfo);
    }
}