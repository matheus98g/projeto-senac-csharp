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
                INSERT INTO aluno (nome, sobrenome, data_nascimento, email, telefone, matricula, ativo)
                VALUES (@Nome, @Sobrenome, @DataNascimento, @Email, @Telefone, @Matricula, @Ativo)
                RETURNING id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<long>(sql, aluno);
        }

        public async Task AtualizarPorId(Aluno aluno)
        {
            var sql = @"
                UPDATE aluno
                SET nome = @Nome,
                    sobrenome = @Sobrenome,
                    data_nascimento = @DataNascimento,
                    email = @Email,
                    telefone = @Telefone,
                    matricula = @Matricula,
                    ativo = @Ativo
                WHERE id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, aluno);
        }

        public async Task DeletarPorId(long id)
        {
            var sql = @"DELETE FROM aluno WHERE id = @Id";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<Aluno> ObterDetalhadoPorId(long id)
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento, email, telefone, matricula, ativo
                FROM aluno
                WHERE id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Aluno>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Aluno>> ObterTodos()
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento, email, telefone, matricula, ativo
                FROM aluno
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Aluno>(sql);
        }
    }
}
