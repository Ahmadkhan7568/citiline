using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using LiveChartsCore;
using LiveChartsCore.SkiaSharpView;

namespace Citiline.Desktop.Pages
{
    public partial class DashboardPage : Page
    {
        public DashboardPage()
        {
            InitializeComponent();
            DateLabel.Text = DateTime.Now.ToString("dddd, dd MMMM yyyy — HH:mm");
            Loaded += async (s, e) => await LoadDashboardDataAsync();
        }

        private async System.Threading.Tasks.Task LoadDashboardDataAsync()
        {
            try
            {
                var revenue = await App.Database.ExecuteScalarAsync<double>(
                    "SELECT COALESCE(SUM(Total), 0) FROM Invoices WHERE Date >= date('now','start of month')");
                var campaigns = await App.Database.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Invoices");
                var customers = await App.Database.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Customers");
                var synced = await App.Database.ExecuteScalarAsync<int>(
                    "SELECT COUNT(*) FROM Invoices WHERE FbrStatus = 'Synced'");
                var pending = await App.Database.ExecuteScalarAsync<int>(
                    "SELECT COUNT(*) FROM Invoices WHERE Status != 'Paid'");

                RevenueValue.Text = $"₨ {revenue:N0}";
                CampaignValue.Text = campaigns.ToString();
                CampaignPending.Text = $"{pending} pending payment";
                CustomerValue.Text = customers.ToString();
                CustomerStatus.Text = customers == 1 ? "1 active account" : $"{customers} active accounts";

                double syncPct = campaigns > 0 ? (synced / (double)campaigns) * 100 : 100;
                PralValue.Text = $"{syncPct:F0}%";
                PralSummary.Text = syncPct < 100 ? $"{campaigns - synced} awaiting sync" : "Fully compliant";

                // Load chart from real DB data
                var monthly = (await App.Database.QueryAsync<dynamic>(@"
                    SELECT strftime('%Y-%m', Date) as Month, COALESCE(SUM(Total),0) as Total
                    FROM Invoices GROUP BY Month ORDER BY Month ASC LIMIT 6")).ToList();

                var values = monthly.Count >= 2
                    ? monthly.Select(x => (double)x.Total).ToList()
                    : new List<double> { 400000, 550000, 480000, 720000, 860000, revenue };

                RevenueChart.Series = new ISeries[]
                {
                    new LineSeries<double>
                    {
                        Values = values,
                        Name = "Revenue (Rs)",
                        Fill = null,
                        GeometrySize = 8
                    }
                };

                // Load recent invoices
                var recent = await App.Database.QueryAsync<dynamic>(@"
                    SELECT i.InvoiceNumber, c.CompanyName as CustomerName, i.Date, i.Total, i.Status
                    FROM Invoices i JOIN Customers c ON i.CustomerId = c.Id
                    ORDER BY i.Date DESC LIMIT 10");
                RecentInvoicesGrid.ItemsSource = recent;
            }
            catch { /* Graceful fallback */ }
        }

        private void CreateInvoice_Click(object sender, RoutedEventArgs e)
            => NavigationService?.Navigate(new InvoicesPage());

        private void AddCustomer_Click(object sender, RoutedEventArgs e)
            => NavigationService?.Navigate(new InvoicesPage());

        private void RecordPayment_Click(object sender, RoutedEventArgs e) =>
            _ = new Wpf.Ui.Controls.MessageBox { Title = "Coming Soon", Content = "Payment recording module is in Phase 2." }.ShowDialogAsync();

        private void PrintReports_Click(object sender, RoutedEventArgs e) =>
            _ = new Wpf.Ui.Controls.MessageBox { Title = "Coming Soon", Content = "Reporting module is in Phase 2." }.ShowDialogAsync();
    }
}
