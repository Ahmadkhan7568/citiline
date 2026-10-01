using System;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace Citiline.Desktop.Pages
{
    public partial class LedgerPage : Page
    {
        public LedgerPage()
        {
            InitializeComponent();
            Loaded += async (s, e) => await LoadLedgerAsync();
        }

        private async System.Threading.Tasks.Task LoadLedgerAsync()
        {
            try
            {
                var ledger = await App.Database.QueryAsync<dynamic>("SELECT * FROM Ledger ORDER BY TransactionDate DESC");
                LedgerGrid.ItemsSource = ledger;
                NoDataText.Visibility = ledger.Any() ? Visibility.Collapsed : Visibility.Visible;
            }
            catch { /* Silent */ }
        }

        private void AddEntry_Click(object sender, RoutedEventArgs e)
        {
            var mb = new Wpf.Ui.Controls.MessageBox
            {
                Title = "Add Ledger Entry",
                Content = "Manual ledger entry form is coming soon."
            };
            _ = mb.ShowDialogAsync();
        }
    }
}
