using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Server.Data;

var AllowedSpecificOrigin = "_allowedSpecificOrigin";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowedSpecificOrigin,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173");
                      });
});

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

var app = builder.Build();

if (!app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    SeedData.Initialze(services, app.Environment);
}


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors(AllowedSpecificOrigin);

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Listing}/{action=Index}/{id?}");

app.Run();
