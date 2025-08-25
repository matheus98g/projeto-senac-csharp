using System.Data;
using Npgsql; // Ensure you have the Npgsql package installed for PostgreSQL support

namespace PortalEducaAPI.Infra.DatabaseConfiguration
{
    public class DbConnectionFactory : IDbConnectionFactory
    {
        private readonly string _connectionString;

        public DbConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IDbConnection CreateConnection()
        {
            return new NpgsqlConnection(_connectionString);
        }
    }
}
