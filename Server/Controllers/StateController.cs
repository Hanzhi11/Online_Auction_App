using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Models;

namespace Server.Controllers;

public class StateController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    public IActionResult Index()
    {
        var states = _context.State.ToList();
        // State states = new("4113", "QLD");
        return Ok(states);
    }
}