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
                    formacao = @FormacaoString::formacao_professor,
                    ativo = @Ativo
                WHERE id = @Id
            ";

            // Converter o enum numérico para string para o PostgreSQL
            var parametros = new
            {
                professor.Id,
                professor.Nome,
                professor.Sobrenome,
                professor.DataDeNascimento,
                professor.Email,
                professor.Telefone,
                professor.DataContratacao,
                FormacaoString = professor.Formacao.ToString(),
                professor.Ativo
            };

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, parametros);
        }
        public async Task<bool> ProfessorPossuiCursosVinculados(long professorId)
        {
            var sql = @"
                SELECT COUNT(1)
                FROM public.curso
                WHERE professor_id = @ProfessorId
            ";

            using var connection = _connectionFactory.CreateConnection();
            int count = await connection.QueryFirstOrDefaultAsync<int>(sql, new { ProfessorId = professorId });

            return count > 0;
        }
        public async Task<long> Cadastrar(Professor professor)
        {
            var sql = @"
                INSERT INTO public.professor
                (nome, sobrenome, data_nascimento, email, telefone, data_contratacao, formacao, ativo)
                VALUES
                (@Nome, @Sobrenome, @DataDeNascimento, @Email, @Telefone, @DataContratacao, @FormacaoString::formacao_professor, @Ativo)
                RETURNING id
            ";

            // Converter o enum numérico para string para o PostgreSQL
            var parametros = new
            {
                professor.Nome,
                professor.Sobrenome,
                professor.DataDeNascimento,
                professor.Email,
                professor.Telefone,
                professor.DataContratacao,
                FormacaoString = professor.Formacao.ToString(),
                professor.Ativo
            };

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<long>(sql, parametros);
        }

        public async Task DeletarPorId(long id)
        {
            var sql = @"DELETE FROM public.professor WHERE id = @Id";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<Professor> ObterDetalhadoPorId(long id)
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento as DataDeNascimento, email, telefone, data_contratacao as DataContratacao, formacao, ativo
                FROM public.professor
                WHERE id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Professor>(sql, new { Id = id }) ?? throw new InvalidOperationException($"Professor with ID {id} not found.");
        }

        public async Task<IEnumerable<Professor>> ObterTodos()
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento as DataDeNascimento, email, telefone, data_contratacao as DataContratacao, formacao, ativo
                FROM public.professor
                ORDER BY nome, sobrenome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Professor>(sql);
        }

        // Método para busca por nome (conforme linha 83 do README - case-insensitive)
        public async Task<IEnumerable<Professor>> BuscarPorNome(string nome)
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento as DataDeNascimento, email, telefone, data_contratacao as DataContratacao, formacao, ativo
                FROM public.professor
                WHERE (LOWER(nome) LIKE LOWER(@Nome) OR LOWER(sobrenome) LIKE LOWER(@Nome))
                ORDER BY nome, sobrenome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Professor>(sql, new { Nome = $"%{nome}%" });
        }

        // Método para obter apenas professores ativos (para vinculação conforme linha 136 do README)
        public async Task<IEnumerable<Professor>> ObterAtivos()
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento as DataDeNascimento, email, telefone, data_contratacao as DataContratacao, formacao, ativo
                FROM public.professor
                WHERE ativo = true
                ORDER BY nome, sobrenome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Professor>(sql);
        }
    }
}

