using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Citiline.Desktop.Services
{
    public class FbrService
    {
        private readonly HttpClient _httpClient;
        private string _bearerToken;
        private string _apiUrl;

        public FbrService(string environment, string bearerToken)
        {
            _httpClient = new HttpClient();
            _bearerToken = bearerToken;
            _apiUrl = environment == "Production" 
                ? "https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata"
                : "https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb";
        }

        public async Task<(bool Success, string Irn, string QrData, string Error)> SubmitInvoiceAsync(object invoicePayload)
        {
            try
            {
                var json = JsonSerializer.Serialize(invoicePayload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _bearerToken);
                
                var response = await _httpClient.PostAsync(_apiUrl, content);
                var responseContent = await response.Content.ReadAsStringAsync();
                
                using var doc = JsonDocument.Parse(responseContent);
                var root = doc.RootElement;

                if (root.GetProperty("code").GetString() == "100")
                {
                    var irn = root.GetProperty("irn").GetString();
                    // QR data logic would go here, matching the format: SellerNTN|BuyerNTN|...
                    return (true, irn, "GeneratedQrData", null);
                }
                else
                {
                    var message = root.TryGetProperty("message", out var msg) ? msg.GetString() : "Unknown FBR error";
                    return (false, null, null, message);
                }
            }
            catch (Exception ex)
            {
                return (false, null, null, ex.Message);
            }
        }
    }
}
