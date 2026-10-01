using System;

namespace Citiline.Desktop.Models
{
    public class Customer
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string CompanyName { get; set; }
        public string NTN { get; set; }
        public string ContactPerson { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

    public class Invoice
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string InvoiceNumber { get; set; }
        public string CustomerId { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public double Subtotal { get; set; }
        public double TaxAmount { get; set; }
        public double Total { get; set; }
        public string Status { get; set; } = "PENDING";
        public string FbrStatus { get; set; } = "Pending";
        public string FbrIrn { get; set; }
        public string FbrQrData { get; set; }

        // UI Helpers
        public string CustomerName { get; set; } 
        public System.Windows.Visibility IsSubmittedVisibility => FbrStatus == "Submitted" ? System.Windows.Visibility.Visible : System.Windows.Visibility.Collapsed;
    }
}
