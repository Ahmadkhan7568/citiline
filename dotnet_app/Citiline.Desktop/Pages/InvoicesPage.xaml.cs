using System.Windows.Controls;
using System.Linq;
using System.IO;
using QuestPDF.Fluent;
using Citiline.Desktop.Services;
using System.Windows;

namespace Citiline.Desktop.Pages
{
    public partial class InvoicesPage : Page
    {
        public InvoicesPage()
        {
            InitializeComponent();
            Loaded += async (s, e) => await LoadInvoicesAsync();
        }

        private async System.Threading.Tasks.Task LoadInvoicesAsync()
        {
            var invoices = await App.Database.QueryAsync<Citiline.Desktop.Models.Invoice>(@"
                SELECT i.*, c.CompanyName as CustomerName 
                FROM Invoices i 
                JOIN Customers c ON i.CustomerId = c.Id
                ORDER BY i.Date DESC");
            
            InvoicesGrid.ItemsSource = invoices;
        }
        private void CreateNew_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            NavigationService?.Navigate(new InvoiceEditorPage());
        }

        private async void Download_Click(object sender, RoutedEventArgs e)
        {
            var btn = (Wpf.Ui.Controls.Button)sender;
            var invoice = (Citiline.Desktop.Models.Invoice)btn.DataContext;
            
            try 
            {
                string invoiceNumber = (string)invoice.InvoiceNumber;
                string filePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), $"Invoice_{invoiceNumber}.pdf");
                
                // Locate logo - search exe directory and project source
                byte[] logoData = null;
                string[] logoPaths = {
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Assets", "logo.png"),
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Assets", "Logo.png"),
                    @"D:\citiline\dotnet_app\Citiline.Desktop\Assets\logo.png"
                };
                foreach (var lp in logoPaths)
                    if (File.Exists(lp)) { logoData = File.ReadAllBytes(lp); break; }

                var document = new InvoiceDocument(invoice, logoData ?? new byte[0]);
                document.GeneratePdf(filePath);

                var mb = new Wpf.Ui.Controls.MessageBox { 
                    Title = "Export Success", 
                    Content = $"Invoice {invoiceNumber} saved to Desktop!" 
                };
                await mb.ShowDialogAsync();
            }
            catch (Exception ex)
            {
                var mb = new Wpf.Ui.Controls.MessageBox { Title = "Error", Content = ex.Message };
                await mb.ShowDialogAsync();
            }
        }
    }
}
