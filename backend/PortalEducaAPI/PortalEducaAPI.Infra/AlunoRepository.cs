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
                INSERT INTO public.aluno (nome, sobrenome, data_nascimento, email, telefone, data_matricula, ativo)
                VALUES (@Nome, @Sobrenome, @DataDeNascimento, @Email, @Telefone, @DataMatricula, @Ativo)
                RETURNING id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<long>(sql, aluno);
        }

        public async Task AtualizarPorId(Aluno aluno)
        {
            var sql = @"
                UPDATE public.aluno
                SET nome = @Nome,
                    sobrenome = @Sobrenome,
                    data_nascimento = @DataDeNascimento,
                    email = @Email,
                    telefone = @Telefone,
                    data_matricula = @DataMatricula,
                    ativo = @Ativo
                WHERE id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, aluno);
        }

        public async Task DeletarPorId(long id)
        {
            var sql = @"DELETE FROM public.aluno WHERE id = @Id";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<Aluno> ObterDetalhadoPorId(long id)
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento as DataDeNascimento, email, telefone, data_matricula as DataMatricula, ativo
                FROM public.aluno
                WHERE id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Aluno>(sql, new { Id = id }) ?? throw new InvalidOperationException($"Aluno with ID {id} not found.");
        }

        public async Task<IEnumerable<Aluno>> ObterTodos()
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento as DataDeNascimento, email, telefone, data_matricula as DataMatricula, ativo
                FROM public.aluno
                ORDER BY nome, sobrenome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Aluno>(sql);
        }

        // Método para busca por nome (conforme linha 91 do README - case-insensitive)
        public async Task<IEnumerable<Aluno>> BuscarPorNome(string nome)
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento as DataDeNascimento, email, telefone, data_matricula as DataMatricula, ativo
                FROM public.aluno
                WHERE (LOWER(nome) LIKE LOWER(@Nome) OR LOWER(sobrenome) LIKE LOWER(@Nome))
                ORDER BY nome, sobrenome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Aluno>(sql, new { Nome = $"%{nome}%" });
        }

        // Método para obter apenas alunos ativos (para vinculação conforme linha 136 do README)
        public async Task<IEnumerable<Aluno>> ObterAtivos()
        {
            var sql = @"
                SELECT id, nome, sobrenome, data_nascimento as DataDeNascimento, email, telefone, data_matricula as DataMatricula, ativo
                FROM public.aluno
                WHERE ativo = true
                ORDER BY nome, sobrenome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Aluno>(sql);
        }
    }
}
