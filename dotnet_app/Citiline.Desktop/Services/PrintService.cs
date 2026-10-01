using System;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.IO;

namespace Citiline.Desktop.Services
{
    public class InvoiceDocument : IDocument
    {
        private Citiline.Desktop.Models.Invoice _invoice;
        private byte[] _logo;

        public InvoiceDocument(Citiline.Desktop.Models.Invoice invoice, byte[] logo)
        {
            _invoice = invoice;
            _logo = logo;
        }

        public void Compose(IDocumentContainer container)
        {
            container
                .Page(page =>
                {
                    page.Margin(50);
                    
                    page.Header().Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("SALES TAX INVOICE").FontSize(20).Black();
                            col.Item().PaddingTop(10).Row(r => {
                                r.AutoItem().Text("INVOICE NO. ").Bold();
                                r.RelativeItem().Text(_invoice.InvoiceNumber);
                            });
                            col.Item().Row(r => {
                                r.AutoItem().Text("DATE: ").Bold();
                                r.RelativeItem().Text(_invoice.Date.ToString("yyyy-MM-dd"));
                            });
                        });

                        row.RelativeItem().Column(col =>
                        {
                            col.Item().AlignRight().Image(_logo);
                            col.Item().AlignRight().Text("Office No. 10/B, Black Horse Plaza,").FontSize(10);
                            col.Item().AlignRight().Text("Fazal-e-Haq Road, Blue Area, Islamabad").FontSize(10);
                            col.Item().AlignRight().Text("NTN No. 1958264-1").FontSize(10).Bold();
                        });
                    });

                    page.Content().PaddingVertical(40).Column(col =>
                    {
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(40);
                                columns.RelativeColumn();
                                columns.ConstantColumn(80);
                                columns.ConstantColumn(80);
                                columns.ConstantColumn(80);
                            });

                            table.Header(header =>
                            {
                                header.Cell().Element(CellStyle).Text("Qty");
                                header.Cell().Element(CellStyle).Text("DESCRIPTION");
                                header.Cell().Element(CellStyle).Text("Rate");
                                header.Cell().Element(CellStyle).Text("GST 18%");
                                header.Cell().Element(CellStyle).Text("Total");

                                static IContainer CellStyle(IContainer container) => container.DefaultTextStyle(x => x.Bold()).BorderBottom(1).PaddingVertical(5);
                            });

                            // Items would go here in a real loop
                            table.Cell().Element(ValueStyle).Text("1");
                            table.Cell().Element(ValueStyle).Text("Media Plan Execution - TV & Digital");
                            table.Cell().Element(ValueStyle).Text(_invoice.Subtotal.ToString("N0"));
                            table.Cell().Element(ValueStyle).Text(_invoice.TaxAmount.ToString("N0"));
                            table.Cell().Element(ValueStyle).Text(_invoice.Total.ToString("N0"));

                            static IContainer ValueStyle(IContainer container) => container.BorderBottom(1, Unit.Point).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                        });

                        col.Item().AlignRight().PaddingTop(20).Text($"Total Payable: Rs {_invoice.Total:N0}").FontSize(16).Bold();
                    });

                    page.Footer().Column(col =>
                    {
                        col.Item().Text("Payment within 7 days.").Bold();
                        col.Item().Text("Bank Al Falah A/C No. 5504 5000 284450");
                    });
                });
        }
    }
}
