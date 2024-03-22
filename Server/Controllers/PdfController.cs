using Amazon;
using Amazon.S3;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Models;
using Server.Services;

namespace Server.Controllers;

public class PdfController(AppDbContext context, IConfiguration iConfig) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly IConfiguration _config = iConfig;

    public IActionResult Index()
    {
        return Ok();
    }

    public IActionResult Get(string? id)
    {
        if (id == null)
        {
            return NotFound("Pdf file not found.");
        }

        Document? document = _context.Document.Where(r => r.Location == $"pdf/{id}").FirstOrDefault();

        if (document == null)
        {
            return NotFound("Pdf file not found.");
        }

        RegionEndpoint bucketRegion = RegionEndpoint.APSoutheast2;
        using AmazonS3Client client = new(bucketRegion);
        Stream stream = new AmazonS3Service(_config).DownloadObjectFromBucketAsync($"pdf/{id}").Result;

        return File(stream, "application/pdf");
    }
}