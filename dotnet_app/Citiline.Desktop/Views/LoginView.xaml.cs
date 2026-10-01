using System.Windows;

namespace Citiline.Desktop.Views
{
    public partial class LoginView : Wpf.Ui.Controls.FluentWindow
    {
        public LoginView()
        {
            InitializeComponent();
        }

        private void SignInButton_Click(object sender, RoutedEventArgs e)
        {
            // Simple hardcoded check for validation right now
            if (UsernameBox.Text == "admin" && PasswordBox.Password == "admin")
            {
                var mainWindow = new MainWindow();
                mainWindow.Show();
                this.Close(); // Close the login window
            }
            else
            {
                MessageBox.Show("Invalid username or password. Try 'admin' and 'admin'.", "Login Failed", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
