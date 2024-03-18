using Fluid;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Utils;
using Server.Models;

namespace Server.Services;

public enum TemplateType
{
    Enquiry
}

public class EmailService(IConfiguration iConfig, IWebHostEnvironment env)
{
    private readonly IConfiguration _config = iConfig;
    private readonly IWebHostEnvironment _env = env;

    public string RetrieveTemplate(TemplateType templateType)
    {
        string? templatesPath = _config.GetSection("Path").GetSection("Templates").Value;
        if (templatesPath == null || templatesPath.Length == 0) {
            throw new SystemException("Templates path was not founded in EmailService.");
        }
        string fileName = templateType switch
        {
            TemplateType.Enquiry => "EnquiryTemplate.html",
            _ => throw new ArgumentException("Invalid template type.", nameof(templateType)),
        };
        string fullPath = Path.Combine(templatesPath, fileName);

        StreamReader str = new(fullPath);
        string template = str.ReadToEnd();
        str.Close();
        return template;
    }
    public void SendEnquiryEmail(List<ListingAgent> listingAgents, string address, Enquiry enquiry)
    {
        string htmlTemplate = RetrieveTemplate(TemplateType.Enquiry);

        FluidParser parser = new();
        string? fromEmail = _config.GetSection("EmailService").GetSection("From").Value;
        if (fromEmail == null || fromEmail.Length == 0) {
            throw new SystemException("From email was not founded in EmailService.");
        }
        string? appPassword = _config.GetSection("EmailService").GetSection("AppPassword").Value;
        if (appPassword == null || appPassword.Length == 0) {
            throw new SystemException("App password was not founded in EmailService.");
        }

        if (parser.TryParse(htmlTemplate, out IFluidTemplate template, out string error))
        {
            List<MimeMessage> messages = [];
            List<string> subjects = [..enquiry.Subjects.Select(s => s.ToString().Replace("_", " "))];

            var model = new { Address = address, enquiry.Name, enquiry.Email, enquiry.ContactNumber, enquiry.Message, Subjects = subjects };
            TemplateContext context = new(model);
            htmlTemplate = template.Render(context);

            foreach (ListingAgent listingAgent in listingAgents)
            {
                MimeMessage message = new();
                message.From.Add(new MailboxAddress("BidNow", fromEmail));
                if (!_env.IsProduction())
                {
                    message.To.Add(new MailboxAddress("Agent", _config.GetSection("EmailService").GetSection("ToAgent").Value!));
                }
                else
                {
                    message.To.Add(new MailboxAddress(listingAgent.Agent!.FirstName, listingAgent.Agent!.Email));
                }
                message.Subject = $"Listing Enquiry: {address}";

                BodyBuilder builder = new();
                MimeEntity phoneImage = builder.LinkedResources.Add("./wwwroot/telephone.png");
                MimeEntity emailImage = builder.LinkedResources.Add("./wwwroot/mail.png");
                phoneImage.ContentId = MimeUtils.GenerateMessageId();
                emailImage.ContentId = MimeUtils.GenerateMessageId();
                builder.HtmlBody = htmlTemplate
                .Replace("[phone]", phoneImage.ContentId)
                .Replace("[email]", emailImage.ContentId)
                .Replace("[AgentName]", listingAgent.Agent!.FirstName);
                message.Body = builder.ToMessageBody();
                messages.Add(message);
            }

            Parallel.ForEach(messages, message =>
            {
                using SmtpClient client = new();
                client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                client.Authenticate(fromEmail, appPassword);
                client.Send(message);
            });
        }
        else
        {
            throw new FormatException(error);
        }
    }
}