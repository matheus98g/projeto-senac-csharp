using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using PortalEducaAPI.Domain.Models;
using PortalEducaAPI.Domain.Repository;
using PortalEducaAPI.Infra.DatabaseConfiguration;

namespace PortalEducaAPI.Infra
{
    public class ProfessorRepository : IProfessorRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public ProfessorRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task AtualizarPorId(Professor professor)
        {
            var sql = @"
                UPDATE Professor
                SET Nome = @Nome,
                    Sobrenome = @Sobrenome,
                    DataDeNascimento = @DataDeNascimento,
                    Email = @Email,
                    Telefone = @Telefone,
                    DataContratacao = @DataContratacao,
                    FormacaoId = @FormacaoId,
                    Ativo = @Ativo
                WHERE Id = @Id
            ";

            var connection = _connectionFactory.CreateConnection();
            await connection.QueryFirstOrDefaultAsync(sql, professor);
        }

        public async Task<long> Cadastrar(Professor professor)
        {
            var sql = @"
                INSERT INTO Professor
                (Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataContratacao, FormacaoId, Ativo)
                OUTPUT INSERTED.Id
                VALUES
                (@Nome, @Sobrenome, @DataDeNascimento, @Email, @Telefone, @DataContratacao, @FormacaoId, @Ativo)
            ";

            var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<long>(sql, professor);
        }

        public async Task DeletarPorId(long id)
        {
            var sql = @"DELETE FROM Professor WHERE Id = @Id";

            var connection = _connectionFactory.CreateConnection();
            await connection.QueryFirstOrDefaultAsync(sql, new { Id = id });
        }

        public async Task DevolverJogo(Professor professor)
        {
            var sql = @"
            UPDATE Jogos
            SET
                Disponivel = @Disponivel,
                Responsavel = @Responsavel,
                DataEntrega = @DataEntrega
            WHERE
                Id = @Id
        ";

            var connection = _connectionFactory.CreateConnection();
            await connection.QueryFirstOrDefaultAsync(sql, professor);
        }

        public async Task<Professor> ObterDetalhadoPorId(long id)
        {
            var sql = @"
                SELECT Id, Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataContratacao, FormacaoId, Ativo
                FROM Professor
                WHERE Id = @Id
            ";

            var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Professor>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Professor>> ObterTodos()
        {
            var sql = @"
                SELECT Id, Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataContratacao, FormacaoId, Ativo
                FROM Professor
            ";

            var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Professor>(sql);
        }
    }

}

