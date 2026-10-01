using System;
using System.Windows;
using System.Windows.Controls;

namespace Citiline.Desktop.Pages
{
    public partial class CustomerEditorPage : Page
    {
        public CustomerEditorPage()
        {
            InitializeComponent();
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            NavigationService?.GoBack();
        }

        private async void SaveCustomer_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(CompanyNameBox.Text))
                {
                    await ShowMessage("Error", "Company Name is required.");
                    return;
                }

                var customer = new
                {
                    Id = Guid.NewGuid().ToString(),
                    CompanyName = CompanyNameBox.Text,
                    NTN = NtnBox.Text,
                    ContactPerson = ContactBox.Text,
                    Email = EmailBox.Text,
                    Phone = PhoneBox.Text,
                    Address = AddressBox.Text
                };

                await App.Database.ExecuteAsync(@"
                    INSERT INTO Customers (Id, CompanyName, NTN, ContactPerson, Email, Phone, Address) 
                    VALUES (@Id, @CompanyName, @NTN, @ContactPerson, @Email, @Phone, @Address)", 
                    customer);

                NavigationService?.Navigate(new CustomersPage());
            }
            catch (Exception ex)
            {
                await ShowMessage("Error", "Failed to register customer: " + ex.Message);
            }
        }

        private async System.Threading.Tasks.Task ShowMessage(string title, string content)
        {
            var mb = new Wpf.Ui.Controls.MessageBox
            {
                Title = title,
                Content = content
            };
            await mb.ShowDialogAsync();
        }
    }
}
