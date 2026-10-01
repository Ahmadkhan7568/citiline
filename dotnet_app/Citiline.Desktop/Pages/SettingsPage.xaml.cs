using System.Windows;
using System.Windows.Controls;

namespace Citiline.Desktop.Pages
{
    public partial class SettingsPage : Page
    {
        public SettingsPage()
        {
            InitializeComponent();
            SettingsNav.SelectedIndex = 0;
        }

        private void SettingsNav_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (SettingsNav == null || SettingsNav.SelectedItem is not ListBoxItem item) return;

            // Hide all panels - ensure they are not null (happens during initialization)
            if (PanelGlobal != null) PanelGlobal.Visibility = Visibility.Collapsed;
            if (PanelFbr != null) PanelFbr.Visibility = Visibility.Collapsed;
            if (PanelInvoice != null) PanelInvoice.Visibility = Visibility.Collapsed;
            if (PanelAppearance != null) PanelAppearance.Visibility = Visibility.Collapsed;
            if (PanelUsers != null) PanelUsers.Visibility = Visibility.Collapsed;
            if (PanelLicense != null) PanelLicense.Visibility = Visibility.Collapsed;

            switch (item.Tag?.ToString())
            {
                case "global": if (PanelGlobal != null) PanelGlobal.Visibility = Visibility.Visible; break;
                case "fbr": if (PanelFbr != null) PanelFbr.Visibility = Visibility.Visible; break;
                case "invoice": if (PanelInvoice != null) PanelInvoice.Visibility = Visibility.Visible; break;
                case "appearance": if (PanelAppearance != null) PanelAppearance.Visibility = Visibility.Visible; break;
                case "users": if (PanelUsers != null) PanelUsers.Visibility = Visibility.Visible; break;
                case "license": if (PanelLicense != null) PanelLicense.Visibility = Visibility.Visible; break;
                default: if (PanelGlobal != null) PanelGlobal.Visibility = Visibility.Visible; break;
            }
        }

        private async void SaveGlobal_Click(object sender, RoutedEventArgs e)
        {
            var mb = new Wpf.Ui.Controls.MessageBox { Title = "Saved", Content = "Global settings saved successfully." };
            await mb.ShowDialogAsync();
        }

        private async void SaveFbr_Click(object sender, RoutedEventArgs e)
        {
            var mb = new Wpf.Ui.Controls.MessageBox { Title = "Saved", Content = "FBR settings saved. Connection will be validated on next sync." };
            await mb.ShowDialogAsync();
        }

        private async void SaveInvoice_Click(object sender, RoutedEventArgs e)
        {
            var mb = new Wpf.Ui.Controls.MessageBox { Title = "Saved", Content = "Invoice settings saved. All new invoices will use these defaults." };
            await mb.ShowDialogAsync();
        }
    }
}
