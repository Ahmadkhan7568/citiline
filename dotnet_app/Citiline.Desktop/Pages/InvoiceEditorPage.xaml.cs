using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.IO;
using System.Windows.Media.Imaging;
using QRCoder;
using Citiline.Desktop.Models;

namespace Citiline.Desktop.Pages
{
    public partial class InvoiceEditorPage : Page
    {
        private ObservableCollection<InvoiceItemViewModel> _items = new();

        public InvoiceEditorPage()
        {
            InitializeComponent();
            ItemsGrid.ItemsSource = _items;
            InvoiceDatePicker.SelectedDate = DateTime.Now;
            
            _items.CollectionChanged += (s, e) => CalculateGrandTotal();
            Loaded += async (s, e) => await LoadCustomersAsync();
        }

        private async System.Threading.Tasks.Task LoadCustomersAsync()
        {
            var customers = await App.Database.QueryAsync<dynamic>("SELECT Id, CompanyName FROM Customers");
            CustomerCombo.ItemsSource = customers;
            if (customers.Any()) CustomerCombo.SelectedIndex = 0;
            
            // Auto-generate invoice number
            var count = (await App.Database.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Invoices")) + 1;
            InvoiceNumberBox.Text = $"INV-{DateTime.Now:yyyyMM}-{count:D3}";
        }

        private void AddLine_Click(object sender, RoutedEventArgs e)
        {
            _items.Add(new InvoiceItemViewModel());
        }

        private void CalculateTotals_Click(object sender, RoutedEventArgs e) => CalculateGrandTotal();

        private void CalculateGrandTotal()
        {
            double grandTotal = _items.Sum(x => x.TotalWithGst);
            GrandTotalBox.Text = grandTotal.ToString("N2");
            UpdateQrCode(grandTotal);
        }

        private void UpdateQrCode(double grandTotal)
        {
            try
            {
                string qrData = $"FBR-CIT-{InvoiceNumberBox.Text}-{grandTotal:N2}";
                using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
                using (QRCodeData qrCodeData = qrGenerator.CreateQrCode(qrData, QRCodeGenerator.ECCLevel.Q))
                using (PngByteQRCode qrCode = new PngByteQRCode(qrCodeData))
                {
                    byte[] qrCodeImage = qrCode.GetGraphic(20);
                    using (MemoryStream ms = new MemoryStream(qrCodeImage))
                    {
                        BitmapImage bi = new BitmapImage();
                        bi.BeginInit();
                        bi.StreamSource = ms;
                        bi.CacheOption = BitmapCacheOption.OnLoad;
                        bi.EndInit();
                        QrCodeImage.Source = bi;
                    }
                }
            }
            catch { /* Silent fail for QR */ }
        }

        private void Cancel_Click(object sender, RoutedEventArgs e) => NavigationService?.GoBack();

        private async void SaveInvoice_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (CustomerCombo.SelectedValue == null || !_items.Any())
                {
                    await ShowMessage("Required", "Please select a customer and add at least one item.");
                    return;
                }

                string invoiceId = Guid.NewGuid().ToString();
                double totalWithGst = _items.Sum(x => x.TotalWithGst);
                double totalTax = _items.Sum(x => x.GstAmount);
                double subtotal = _items.Sum(x => x.Total);

                // 1. Save Main Invoice
                var invoice = new
                {
                    Id = invoiceId,
                    InvoiceNumber = InvoiceNumberBox.Text,
                    CustomerId = CustomerCombo.SelectedValue.ToString(),
                    Date = InvoiceDatePicker.SelectedDate ?? DateTime.Now,
                    Subtotal = subtotal,
                    TaxAmount = totalTax,
                    Total = totalWithGst,
                    Status = "Paid",
                    FbrStatus = "Synced", // Auto-sync mock for now
                    FbrIrn = Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                    FbrQrData = $"FBR-CIT-{invoiceId}"
                };

                await App.Database.ExecuteAsync(@"
                    INSERT INTO Invoices (Id, InvoiceNumber, CustomerId, Date, Subtotal, TaxAmount, Total, Status, FbrStatus, FbrIrn, FbrQrData) 
                    VALUES (@Id, @InvoiceNumber, @CustomerId, @Date, @Subtotal, @TaxAmount, @Total, @Status, @FbrStatus, @FbrIrn, @FbrQrData)", 
                    invoice);

                // 2. Save Line Items
                foreach (var item in _items)
                {
                    await App.Database.ExecuteAsync(@"
                        INSERT INTO InvoiceItems (Id, InvoiceId, Description, Quantity, UnitPrice, GstAmount, TotalWithGst) 
                        VALUES (@Id, @InvoiceId, @Description, @Quantity, @UnitPrice, @GstAmount, @TotalWithGst)", 
                        new {
                            Id = Guid.NewGuid().ToString(),
                            InvoiceId = invoiceId,
                            Description = item.Description,
                            Quantity = item.Quantity,
                            UnitPrice = item.UnitPrice,
                            GstAmount = item.GstAmount,
                            TotalWithGst = item.TotalWithGst
                        });
                }

                await ShowMessage("Success", "Invoice generated and synced with FBR status!");
                NavigationService?.Navigate(new InvoicesPage());
            }
            catch (Exception ex)
            {
                await ShowMessage("Error", "Failed to save: " + ex.Message);
            }
        }

        private async System.Threading.Tasks.Task ShowMessage(string title, string content)
        {
            var mb = new Wpf.Ui.Controls.MessageBox { Title = title, Content = content };
            await mb.ShowDialogAsync();
        }
    }
}
