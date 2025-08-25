using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using PortalEducaAPI.Domain.Models;
using PortalEducaAPI.Domain.Repository;
using PortalEducaAPI.Infra.DatabaseConfiguration;

namespace PortalEducaAPI.Infra
{
    public class CursoRepository : ICursoRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public CursoRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<long> Cadastrar(Curso curso)
        {
            var sql = @"
                INSERT INTO public.curso
                (nome, descricao, data_criacao, categoria, valor, carga_horaria, professor_id, ativo)
                VALUES
                (@Nome, @Descricao, @DataCriacao, @Categoria, @Valor, @CargaHoraria, @ProfessorId, @Ativo)
                RETURNING id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<long>(sql, curso);
        }

        public async Task AtualizarPorId(Curso curso)
        {
            var sql = @"
                UPDATE public.curso
                SET nome = @Nome,
                    descricao = @Descricao,
                    categoria = @Categoria,
                    valor = @Valor,
                    carga_horaria = @CargaHoraria,
                    professor_id = @ProfessorId,
                    ativo = @Ativo
                WHERE id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, curso);
        }

        public async Task DeletarPorId(long id)
        {
            var sql = @"DELETE FROM public.curso WHERE id = @Id";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<Curso> ObterDetalhadoPorId(long id)
        {
            var sql = @"
                SELECT id, nome, descricao, data_criacao, categoria, valor, carga_horaria, professor_id, ativo
                FROM public.curso
                WHERE id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Curso>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Curso>> ObterTodos()
        {
            var sql = @"
                SELECT id, nome, descricao, data_criacao, categoria, valor, carga_horaria, professor_id, ativo
                FROM public.curso
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Curso>(sql);
        }
    }
}