using System;
using System.IO;
using System.Windows;
using System.Windows.Threading;
using QuestPDF.Infrastructure;

namespace Citiline.Desktop
{
    public partial class App : Application
    {
        public static Services.DatabaseService Database { get; private set; } = null!;

        public App()
        {
            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;
            this.DispatcherUnhandledException += App_DispatcherUnhandledException;
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            // Initialize DB
            string dbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "citiline.db");
            Database = new Services.DatabaseService(dbPath);
            _ = SeedDataAsync();
        }

        private async System.Threading.Tasks.Task SeedDataAsync()
        {
            // Seed sample customer if none exists
            var count = await Database.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Customers");
            if (count == 0)
            {
                var customerId = Guid.NewGuid().ToString();
                await Database.ExecuteAsync(@"
                    INSERT INTO Customers (Id, CompanyName, NTN, Email, Phone) 
                    VALUES (@Id, 'Example Ad Agency', '1234567-8', 'info@example.com', '0300-1122334')", 
                    new { Id = customerId });

                await Database.ExecuteAsync(@"
                    INSERT INTO Invoices (Id, InvoiceNumber, CustomerId, Date, Subtotal, TaxAmount, Total, Status, FbrStatus) 
                    VALUES (@Id, 'INV-001', @CustomerId, date('now'), 75000, 13500, 88500, 'Paid', 'Synced')", 
                    new { Id = Guid.NewGuid().ToString(), CustomerId = customerId });

                // Seed Sample Employees
                var empId = Guid.NewGuid().ToString();
                await Database.ExecuteAsync(@"
                    INSERT INTO Employees (Id, FullName, Designation, Salary, JoinDate) 
                    VALUES (@Id, 'Zubair Ahmad', 'Creative Director', 150000, date('now','-1 year'))", 
                    new { Id = empId });

                // Seed Sample Ledger
                await Database.ExecuteAsync(@"
                    INSERT INTO Ledger (Id, Description, Debit, Credit, Balance) 
                    VALUES (@Id, 'Opening Balance - Agency Cash', 0, 500000, 500000)", 
                    new { Id = Guid.NewGuid().ToString() });
            }
        }

        private void App_DispatcherUnhandledException(object sender, DispatcherUnhandledExceptionEventArgs e)
        {
            File.WriteAllText("crash.log", "Dispatcher Exception:\n" + e.Exception.ToString() + "\n\nInner Exception:\n" + e.Exception.InnerException?.ToString());
            Environment.Exit(1);
        }

        private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            File.WriteAllText("crash.log", "AppDomain Exception:\n" + e.ExceptionObject.ToString());
            Environment.Exit(1);
        }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            var loginView = new Views.LoginView();
            loginView.Show();
        }
    }
}
