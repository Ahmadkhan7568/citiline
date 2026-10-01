using System;
using System.Linq;
using System.Windows.Controls;

namespace Citiline.Desktop.Pages
{
    public partial class EmployeeListPage : Page
    {
        public EmployeeListPage()
        {
            InitializeComponent();
            Loaded += async (s, e) => await LoadEmployeesAsync();
        }

        private async System.Threading.Tasks.Task LoadEmployeesAsync()
        {
            try
            {
                var employees = await App.Database.QueryAsync<dynamic>("SELECT * FROM Employees ORDER BY JoinDate DESC");
                EmployeesGrid.ItemsSource = employees;
                NoDataText.Visibility = employees.Any() ? System.Windows.Visibility.Collapsed : System.Windows.Visibility.Visible;
            }
            catch { /* Silent */ }
        }
    }
}
