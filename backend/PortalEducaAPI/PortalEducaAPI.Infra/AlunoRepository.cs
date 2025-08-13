using Dapper;
using System.Data;
using PortalEducaAPI.Domain.Models;
using PortalEducaAPI.Domain.Repository;
using PortalEducaAPI.Infra.DatabaseConfiguration;

namespace PortalEducaAPI.Infra
{
    public class AlunoRepository : IAlunoRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public AlunoRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<long> Cadastrar(Aluno aluno)
        {
            var sql = @"
                INSERT INTO Aluno (Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataMatricula, Ativo)
                OUTPUT INSERTED.Id
                VALUES (@Nome, @Sobrenome, @DataDeNascimento, @Email, @Telefone, @DataMatricula, @Ativo)
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<long>(sql, aluno);
        }

        public async Task AtualizarPorId(Aluno aluno)
        {
            var sql = @"
                UPDATE Aluno
                SET Nome = @Nome,
                    Sobrenome = @Sobrenome,
                    DataDeNascimento = @DataDeNascimento,
                    Email = @Email,
                    Telefone = @Telefone,
                    DataMatricula = @DataMatricula,
                    Ativo = @Ativo
                WHERE Id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, aluno);
        }

        public async Task DeletarPorId(long id)
        {
            var sql = @"DELETE FROM Aluno WHERE Id = @Id";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<Aluno> ObterDetalhadoPorId(long id)
        {
            var sql = @"
                SELECT Id, Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataMatricula, Ativo
                FROM Aluno
                WHERE Id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Aluno>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Aluno>> ObterTodos()
        {
            var sql = @"
                SELECT Id, Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataMatricula, Ativo
                FROM Aluno
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Aluno>(sql);
        }
    }
}
