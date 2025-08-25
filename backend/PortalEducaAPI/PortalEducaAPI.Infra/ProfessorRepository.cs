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
                UPDATE public.professor
                SET nome = @Nome,
                    sobrenome = @Sobrenome,
                    data_nascimento = @DataDeNascimento,
                    email = @Email,
                    telefone = @Telefone,
                    data_contratacao = @DataContratacao,
                    formacao = @Formacao,
                    ativo = @Ativo
                WHERE id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, professor);
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
                INSERT INTO public.professor
                (nome, sobrenome, data_nascimento, email, telefone, data_contratacao, formacao, ativo)
                VALUES
                (@Nome, @Sobrenome, @DataDeNascimento, @Email, @Telefone, @DataContratacao, @Formacao, @Ativo)
                RETURNING id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<long>(sql, professor);
        }

        public async Task DeletarPorId(long id)
        {
            var sql = @"DELETE FROM professor WHERE id = @Id";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<Professor> ObterDetalhadoPorId(long id)
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento, email, telefone, data_contratacao, formacao, ativo
                FROM public.professor
                WHERE id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Professor>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Professor>> ObterTodos()
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento, email, telefone, data_contratacao, formacao, ativo
                FROM public.professor
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Professor>(sql);
        }

    }

}

