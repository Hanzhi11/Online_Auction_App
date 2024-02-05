using Microsoft.AspNetCore.Mvc;
using Server.Models;

namespace Server.Controllers;

public class StateController: ControllerBase
{
    public IActionResult Index()
    {
        State state1 = new("4113", "QLD");
        return Ok(state1);
    }
}