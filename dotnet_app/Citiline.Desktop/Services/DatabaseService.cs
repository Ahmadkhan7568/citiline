using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.Sqlite;

namespace Citiline.Desktop.Services
{
    public class DatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(string dbPath)
        {
            _connectionString = $"Data Source={dbPath}";
            InitializeDatabase();
        }

        private void InitializeDatabase()
        {
            using var connection = new SqliteConnection(_connectionString);
            connection.Open();

            // Create basic tables if they don't exist
            connection.Execute(@"
                CREATE TABLE IF NOT EXISTS Customers (
                    Id TEXT PRIMARY KEY,
                    CompanyName TEXT NOT NULL,
                    NTN TEXT,
                    ContactPerson TEXT,
                    Email TEXT,
                    Phone TEXT,
                    Address TEXT,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS Invoices (
                    Id TEXT PRIMARY KEY,
                    InvoiceNumber TEXT NOT NULL,
                    CustomerId TEXT NOT NULL,
                    Date DATETIME NOT NULL,
                    Subtotal DECIMAL(18,2),
                    TaxAmount DECIMAL(18,2), -- GST 18%
                    Total DECIMAL(18,2),
                    Status TEXT,
                    FbrStatus TEXT,
                    FbrIrn TEXT,
                    FbrQrData TEXT,
                    FOREIGN KEY(CustomerId) REFERENCES Customers(Id)
                );

                CREATE TABLE IF NOT EXISTS InvoiceItems (
                    Id TEXT PRIMARY KEY,
                    InvoiceId TEXT NOT NULL,
                    Description TEXT,
                    Quantity DECIMAL(18,2),
                    UnitPrice DECIMAL(18,2),
                    GstAmount DECIMAL(18,2),
                    TotalWithGst DECIMAL(18,2),
                    FOREIGN KEY(InvoiceId) REFERENCES Invoices(Id)
                );

                CREATE TABLE IF NOT EXISTS Employees (
                    Id TEXT PRIMARY KEY,
                    FullName TEXT NOT NULL,
                    Designation TEXT,
                    CNIC TEXT,
                    Phone TEXT,
                    Salary DECIMAL(18,2),
                    JoinDate DATETIME
                );

                CREATE TABLE IF NOT EXISTS Payroll (
                    Id TEXT PRIMARY KEY,
                    EmployeeId TEXT NOT NULL,
                    SalaryMonth TEXT,
                    PaymentDate DATETIME,
                    Amount DECIMAL(18,2),
                    Status TEXT,
                    FOREIGN KEY(EmployeeId) REFERENCES Employees(Id)
                );

                CREATE TABLE IF NOT EXISTS Ledger (
                    Id TEXT PRIMARY KEY,
                    TransactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                    Description TEXT,
                    Debit DECIMAL(18,2),
                    Credit DECIMAL(18,2),
                    Balance DECIMAL(18,2)
                );
            ");
        }

        public async Task<T> ExecuteScalarAsync<T>(string sql, object param = null)
        {
            using var connection = new SqliteConnection(_connectionString);
            return await connection.ExecuteScalarAsync<T>(sql, param);
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object param = null)
        {
            using var connection = new SqliteConnection(_connectionString);
            return await connection.QueryAsync<T>(sql, param);
        }

        public async Task<int> ExecuteAsync(string sql, object param = null)
        {
            using var connection = new SqliteConnection(_connectionString);
            return await connection.ExecuteAsync(sql, param);
        }
    }
}
