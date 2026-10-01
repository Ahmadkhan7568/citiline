using CommunityToolkit.Mvvm.ComponentModel;

namespace Citiline.Desktop.Models
{
    public partial class InvoiceItemViewModel : ObservableObject
    {
        [ObservableProperty]
        private string _description = "";

        [ObservableProperty]
        private double _quantity = 1;

        [ObservableProperty]
        private double _unitPrice = 0;

        public double Total => Quantity * UnitPrice;
        public double GstAmount => Total * 0.18; // GST 18%
        public double TotalWithGst => Total + GstAmount;

        // Notify parents when values change
        partial void OnQuantityChanged(double value) => OnAllChanged();
        partial void OnUnitPriceChanged(double value) => OnAllChanged();

        private void OnAllChanged()
        {
            OnPropertyChanged(nameof(Total));
            OnPropertyChanged(nameof(GstAmount));
            OnPropertyChanged(nameof(TotalWithGst));
        }
    }
}
