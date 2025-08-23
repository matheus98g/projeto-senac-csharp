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
                SET 
                    Nome = @Nome,
                    Sobrenome = @Sobrenome,
                    DataDeNascimento = @DataDeNascimento,
                    Email = @Email,
                    Telefone = @Telefone,
                    DataContratacao = @DataContratacao,
                    FormacaoProfessorId = @Formacao,
                    Ativo = @Ativo
                WHERE Id = @Id
            ";


            var connection = _connectionFactory.CreateConnection();
            await connection.QueryFirstOrDefaultAsync(sql, professor);
        }
        public async Task<bool> ProfessorPossuiCursosVinculados(long professorId)
        {
            var sql = @"
        SELECT COUNT(1)
        FROM Curso
        WHERE ProfessorId = @ProfessorId
    ";

            var connection = _connectionFactory.CreateConnection();
            int count = await connection.QueryFirstOrDefaultAsync<int>(sql, new { ProfessorId = professorId });

            return count > 0;
        }
        public async Task<long> Cadastrar(Professor professor)
        {
            var sql = @"
                INSERT INTO Professor
                (Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataContratacao, FormacaoProfessorId, Ativo)
                OUTPUT INSERTED.Id
                VALUES
                (@Nome, @Sobrenome, @DataDeNascimento, @Email, @Telefone, @DataContratacao, @Formacao, @Ativo)
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

       

        public async Task<Professor> ObterDetalhadoPorId(long id)
        {
            var sql = @"
                SELECT 
                    p.Id,
                    p.Nome,
                    p.Sobrenome,
                    p.DataDeNascimento,
                    p.Email,
                    p.Telefone,
                    p.DataContratacao,
                    cc.Id AS Formacao,
                    p.Ativo
                FROM Professor p
                INNER JOIN FormacaoProfessor cc ON cc.Id = p.FormacaoProfessorId
                WHERE p.Id = @Id
            ";


            var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Professor>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Professor>> ObterTodos()
        {
            var sql = @"
                SELECT Id, Nome, Sobrenome, DataDeNascimento, Email, Telefone, DataContratacao, FormacaoProfessorId, Ativo
                FROM Professor
            ";

            var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Professor>(sql);
        }
    }

}

