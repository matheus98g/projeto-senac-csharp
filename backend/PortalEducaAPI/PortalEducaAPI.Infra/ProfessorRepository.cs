using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Models;
using PortalEducaAPI.Domain.Repository;

namespace PortalEducaAPI.Infra
{
    public class ProfessorRepository : IProfessorRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public JogoRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task AtualizarPorId(Aluno aluno)
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
            await connection.QueryFirstOrDefaultAsync(sql, aluno);
        }

        public async Task<long> Cadastrar(Aluno aluno)
        {
            var sql = @"
                INSERT INTO Professor
                (Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataContratacao, FormacaoId, Ativo)
                OUTPUT INSERTED.Id
                VALUES
                (@Nome, @Sobrenome, @DataDeNascimento, @Email, @Telefone, @DataContratacao, @FormacaoId, @Ativo)
            ";

            var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<long>(sql, jogo);
        }

        public async Task DeletarPorId(long id)
        {
            var sql = @"DELETE FROM Professor WHERE Id = @Id";

            var connection = _connectionFactory.CreateConnection();
            await connection.QueryFirstOrDefaultAsync(sql, new { Id = id });
        }

        public async Task DevolverJogo(Aluno aluno)
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
            await connection.QueryFirstOrDefaultAsync(sql, aluno);
        }

        public async Task<Aluno> ObterDetalhadoPorId(long id)
        {
            var sql = @"
                SELECT Id, Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataContratacao, FormacaoId, Ativo
                FROM Professor
                WHERE Id = @Id
            ";

            var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Aluno>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Aluno>> ObterTodos()
        {
            var sql = @"
                SELECT Id, Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataContratacao, FormacaoId, Ativo
                FROM Professor
            ";

            var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Aluno>(sql);
        }
    }

}

