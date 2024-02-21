namespace Server.Data;

public class ImageDownloader
{
    public async Task<byte[][]> DownloadImagesAsync(IEnumerable<string> imageUrls)
    {
        List<Task<byte[]>> downloadTasks = new List<Task<byte[]>>();

        using (HttpClient httpClient = new HttpClient())
        {
            foreach (string imageUrl in imageUrls)
            {
                Task<byte[]> downloadTask = DownloadImageAsync(httpClient, imageUrl);
                downloadTasks.Add(downloadTask);
            }

            // Wait for all download tasks to complete
            byte[][] imageBytesArray = await Task.WhenAll(downloadTasks);

            return imageBytesArray;
        }
    }

    private async Task<byte[]> DownloadImageAsync(HttpClient httpClient, string imageUrl)
    {
        try
        {
            // Make a GET request to the image URL
            HttpResponseMessage response = await httpClient.GetAsync(imageUrl);

            // Check if the request was successful
            response.EnsureSuccessStatusCode();

            // Read the image data as a byte array
            byte[] imageBytes = await response.Content.ReadAsByteArrayAsync();

            return imageBytes;
        }
        catch (HttpRequestException ex)
        {
            // Handle request errors
            Console.WriteLine($"Error retrieving image '{imageUrl}': {ex.Message}");
            return null;
        }
    }
}
