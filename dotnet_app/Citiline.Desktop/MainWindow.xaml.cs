using System.Windows;
using System.Windows.Controls;
using Wpf.Ui.Controls;
using Citiline.Desktop.Pages;

namespace Citiline.Desktop
{
    public partial class MainWindow : Wpf.Ui.Controls.FluentWindow
    {
        public MainWindow()
        {
            InitializeComponent();
            Loaded += (s, e) => RootFrame.Navigate(new DashboardPage());
        }

        private void SidebarList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (RootFrame == null) return;
            if (SidebarList.SelectedItem is ListBoxItem item)
            {
                BottomNav.SelectedItem = null;
                string tag = item.Tag?.ToString() ?? string.Empty;
                switch (tag)
                {
                    case "dashboard": RootFrame.Navigate(new DashboardPage()); break;
                    case "invoices": RootFrame.Navigate(new InvoicesPage()); break;
                    case "employees": RootFrame.Navigate(new EmployeeListPage()); break;
                    case "payroll": RootFrame.Navigate(new PayrollPage()); break;
                    case "customers": RootFrame.Navigate(new InvoicesPage()); break;
                    case "ledger": RootFrame.Navigate(new LedgerPage()); break;
                    default: RootFrame.Navigate(new DashboardPage()); break;
                }
            }
        }

        private void BottomNav_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (RootFrame == null) return;
            if (BottomNav.SelectedItem is ListBoxItem item && item.Tag?.ToString() == "settings")
            {
                SidebarList.SelectedItem = null;
                RootFrame.Navigate(new SettingsPage());
            }
        }
    }
}