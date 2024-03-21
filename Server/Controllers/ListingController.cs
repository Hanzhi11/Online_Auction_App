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
        .Include(l => l.Agency)
        .Include(l => l.Photos)];

        List<ListingInfoViewModel> listingsInfo = [];
        foreach (Listing listing in listings)
        {
            ListingInfoViewModel info = listing.GetInformation();
            listingsInfo.Add(info);
        }

        return Ok(listingsInfo);
    }

    public IActionResult Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        Listing? listing = _context.Listing
        .Where(l => l.ListingNumber == id)
        .Include(l => l.Address)
        .ThenInclude(a => a!.State)
        .Include(l => l.ListingAgents)!
        .ThenInclude(la => la.Agent)
        .Include(l => l.Agency)
        .ThenInclude(a => a!.Address)
        .ThenInclude(a => a!.State)
        .Include(l => l.Auctioneer)
        .Include(l => l.Photos)
        .Include(l => l.ListingDocuments)!
        .ThenInclude(lr => lr.Document)
        .FirstOrDefault();

        if (listing == null)
        {
            return NotFound();
        }

        ListingDetailsViewModel details = listing.GetDetails();

        return Ok(details);
    }
}