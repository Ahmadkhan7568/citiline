using System;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace Citiline.Desktop.Pages
{
    public partial class PayrollPage : Page
    {
        public PayrollPage()
        {
            InitializeComponent();
            PopulateMonths();
            Loaded += async (s, e) => await LoadPayrollAsync();
        }

        private void PopulateMonths()
        {
            for (int i = 0; i < 6; i++)
            {
                MonthPicker.Items.Add(DateTime.Now.AddMonths(-i).ToString("MMMM yyyy"));
            }
            MonthPicker.SelectedIndex = 0;
        }

        private async System.Threading.Tasks.Task LoadPayrollAsync()
        {
            try
            {
                var payroll = await App.Database.QueryAsync<dynamic>(@"
                    SELECT p.*, e.FullName as EmployeeName 
                    FROM Payroll p 
                    JOIN Employees e ON p.EmployeeId = e.Id 
                    ORDER BY p.PaymentDate DESC");
                PayrollGrid.ItemsSource = payroll;
                NoDataText.Visibility = payroll.Any() ? Visibility.Collapsed : Visibility.Visible;
            }
            catch { /* Silent */ }
        }

        private async void GenerateSalaries_Click(object sender, RoutedEventArgs e)
        {
            string selectedMonth = MonthPicker.SelectedItem?.ToString() ?? DateTime.Now.ToString("MMMM yyyy");

            var employees = await App.Database.QueryAsync<dynamic>("SELECT * FROM Employees");
            int count = 0;
            foreach (var emp in employees)
            {
                await App.Database.ExecuteAsync(@"
                    INSERT INTO Payroll (Id, EmployeeId, SalaryMonth, PaymentDate, Amount, Status)
                    VALUES (@Id, @EmployeeId, @Month, date('now'), @Amount, 'Paid')",
                    new
                    {
                        Id = Guid.NewGuid().ToString(),
                        EmployeeId = (string)emp.Id,
                        Month = selectedMonth,
                        Amount = (double)emp.Salary
                    });
                count++;
            }

            await LoadPayrollAsync();

            var mb = new Wpf.Ui.Controls.MessageBox
            {
                Title = "Salaries Generated",
                Content = $"Successfully processed {count} employee salaries for {selectedMonth}."
            };
            await mb.ShowDialogAsync();
        }
    }
}
