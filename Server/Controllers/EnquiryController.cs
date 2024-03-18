using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Server.Services;

namespace Server.Controllers;

public class EnquiryController(AppDbContext context, IConfiguration iConfig, IWebHostEnvironment env) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly IConfiguration _config = iConfig;
    private readonly IWebHostEnvironment _env = env;

    [HttpGet]
    public IActionResult Index()
    {
        return Ok("enquiry index");
    }

    [HttpPost]
    public IActionResult Send(int? id, [FromBody] Enquiry enquiry)
    {
        if (id == null)
        {
            return BadRequest("No listing id found in the request.");
        }

        Listing? listing = _context.Listing
        .FirstOrDefault(l => l.ListingNumber == id);

        if (listing == null)
        {
            return NotFound("Listing not found.");
        }

        _context.Entry(listing).Reference(l => l.Address).Load();

        string address = listing.Address!.FormatToFullAddressWithoutState();

        List<ListingAgent> listingAgents = _context.ListingAgent.Where(la => la.ListingId == listing.Id).Include(la => la.Agent).ToList();

        try
        {
            EmailService emailService = new(_config, _env);
            emailService.SendEnquiryEmail(listingAgents, address, enquiry);
            enquiry.Listing = listing;
            _context.Enquiry.Add(enquiry);
            _context.SaveChanges();

            return Created();
        }
        catch (Exception error)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, $"Failed to send enquiry: {error}");
        }
    }
}