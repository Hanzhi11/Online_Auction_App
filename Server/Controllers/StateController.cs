using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Models;

namespace Server.Controllers;

public class StateController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    public IActionResult Index()
    {
        List<State> states = [.. _context.State];
        return Ok(states);
    }
}