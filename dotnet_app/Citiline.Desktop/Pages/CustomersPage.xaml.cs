using System.Windows.Controls;

namespace Citiline.Desktop.Pages
{
    public partial class CustomersPage : Page
    {
        public CustomersPage()
        {
            InitializeComponent();
            Loaded += async (s, e) => await LoadCustomersAsync();
        }

        private async System.Threading.Tasks.Task LoadCustomersAsync()
        {
            var customers = await App.Database.QueryAsync<dynamic>("SELECT * FROM Customers ORDER BY CompanyName");
            CustomersGrid.ItemsSource = customers;
        }

        private void AddCustomer_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            NavigationService?.Navigate(new CustomerEditorPage());
        }
    }
}
