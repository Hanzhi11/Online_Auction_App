using Amazon;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Amazon.S3.Model;

namespace Server.Services;

public class AmazonS3Service(IConfiguration iConfig)
{
    private readonly IConfiguration _config = iConfig;
    private readonly RegionEndpoint bucketRegion = RegionEndpoint.APSoutheast2;

    private readonly string bucketName = "bid-now";

    public async Task<Stream> DownloadObjectFromBucketAsync(
        string objectName
            )
    {
        string? profile = _config.GetSection("AWS").GetSection("S3").GetSection("Profile").Value;
        if(profile == null || profile.Length == 0)
        {
            return new MemoryStream();
        }
        GetObjectRequest request = new()
        {
            BucketName = bucketName,
            Key = objectName,
        };

        var chain = new CredentialProfileStoreChain();
        chain.TryGetAWSCredentials(profile, out AWSCredentials awsCredentials);

        using MemoryStream stream = new();
        using AmazonS3Client client = new(awsCredentials, bucketRegion);
        GetObjectResponse response = await client.GetObjectAsync(request);
        return response.ResponseStream;
    }
}