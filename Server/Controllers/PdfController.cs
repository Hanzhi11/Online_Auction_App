using Amazon;
using Amazon.S3;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Models;
using Server.Services;

namespace Server.Controllers;

public class PdfController(AppDbContext context, IConfiguration iConfig, IWebHostEnvironment env) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly IConfiguration _config = iConfig;
    private readonly IWebHostEnvironment _env = env;

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

        string? parentObject = HttpContext.Request.Query["About"];

        if (parentObject == null)
        {
            return NotFound("Pdf file not found.");
        }

        string objectKey = $"listing/document/{parentObject}/{id}";
        if (!int.TryParse(parentObject, out _))
        {
            objectKey = $"listing/document/shared/{parentObject}/{id}";
        }
        if (_env.IsProduction())
        {
            Document? document = _context.Document.Where(r => r.Location == objectKey).FirstOrDefault();

            if (document == null)
            {
                return NotFound("Pdf file not found.");
            }
            RegionEndpoint bucketRegion = RegionEndpoint.APSoutheast2;
            using AmazonS3Client client = new(bucketRegion);

            Stream stream = new AmazonS3Service(_config).DownloadObjectFromBucketAsync(objectKey).Result;

            return File(stream, "application/pdf");
        }
        else
        {
            string filePath = Path.Combine(_env.ContentRootPath, "public", objectKey);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Pdf file not found.");
            }

            return PhysicalFile(filePath, "application/pdf");
        }
    }
}