using System.Data;

namespace PortalEducaAPI.Infra.DatabaseConfiguration
{
    public interface IDbConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}
