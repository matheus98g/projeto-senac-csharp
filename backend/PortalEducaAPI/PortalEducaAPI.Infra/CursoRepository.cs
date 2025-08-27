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
                (@Nome, @Descricao, @DataCriacao, @CategoriaString::categoria_curso, @Valor, @CargaHoraria, @ProfessorId, @Ativo)
                RETURNING id
            ";

            // Converter o enum numérico para string para o PostgreSQL
            var parametros = new
            {
                curso.Nome,
                curso.Descricao,
                curso.DataCriacao,
                CategoriaString = curso.Categoria.ToString(),
                curso.Valor,
                curso.CargaHoraria,
                curso.ProfessorId,
                curso.Ativo
            };

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<long>(sql, parametros);
        }

        public async Task AtualizarPorId(Curso curso)
        {
            var sql = @"
                UPDATE public.curso
                SET nome = @Nome,
                    descricao = @Descricao,
                    categoria = @CategoriaString::categoria_curso,
                    valor = @Valor,
                    carga_horaria = @CargaHoraria,
                    professor_id = @ProfessorId,
                    ativo = @Ativo
                WHERE id = @Id
            ";

            // Converter o enum numérico para string para o PostgreSQL
            var parametros = new
            {
                curso.Id,
                curso.Nome,
                curso.Descricao,
                CategoriaString = curso.Categoria.ToString(),
                curso.Valor,
                curso.CargaHoraria,
                curso.ProfessorId,
                curso.Ativo
            };

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, parametros);
        }

        public async Task DeletarPorId(long id)
        {
            var sql = @"DELETE FROM public.curso WHERE id = @Id";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, new { Id = id });
        }

        
        async Task<Curso> ICursoRepository.ObterDetalhadoPorId(long id)
        {
            var sql = @"
                SELECT id, nome, descricao, data_criacao as DataCriacao, categoria, valor, carga_horaria as CargaHoraria, professor_id as ProfessorId, ativo
                FROM public.curso
                WHERE id = @Id
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Curso>(sql, new { Id = id }) ?? throw new InvalidOperationException($"Curso with ID {id} not found.");
        }

        public async Task<IEnumerable<Curso>> ObterTodos()
        {
            var sql = @"
                SELECT id, nome, descricao, data_criacao as DataCriacao, categoria, valor, carga_horaria as CargaHoraria, professor_id as ProfessorId, ativo
                FROM public.curso
                ORDER BY nome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Curso>(sql);
        }

        // Método para busca por nome (conforme linha 99 do README)
        public async Task<IEnumerable<Curso>> BuscarPorNome(string nome)
        {
            var sql = @"
                SELECT id, nome, descricao, data_criacao as DataCriacao, categoria, valor, carga_horaria as CargaHoraria, professor_id as ProfessorId, ativo
                FROM public.curso
                WHERE LOWER(nome) LIKE LOWER(@Nome)
                ORDER BY nome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Curso>(sql, new { Nome = $"%{nome}%" });
        }

        // Método para filtrar por categoria (conforme linha 99 do README)
        public async Task<IEnumerable<Curso>> BuscarPorCategoria(CategoriaCurso categoria)
        {
            var sql = @"
                SELECT id, nome, descricao, data_criacao as DataCriacao, categoria, valor, carga_horaria as CargaHoraria, professor_id as ProfessorId, ativo
                FROM public.curso
                WHERE categoria = @CategoriaString::categoria_curso
                ORDER BY nome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Curso>(sql, new { CategoriaString = categoria.ToString() });
        }

        // Método para filtrar por valor mínimo (conforme linha 99 do README)
        public async Task<IEnumerable<Curso>> BuscarPorValorMinimo(decimal valorMinimo)
        {
            var sql = @"
                SELECT id, nome, descricao, data_criacao as DataCriacao, categoria, valor, carga_horaria as CargaHoraria, professor_id as ProfessorId, ativo
                FROM public.curso
                WHERE valor >= @ValorMinimo
                ORDER BY valor, nome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Curso>(sql, new { ValorMinimo = valorMinimo });
        }

        // Método para filtros combinados (conforme linha 99 do README)
        public async Task<IEnumerable<Curso>> BuscarComFiltros(string? nome = null, CategoriaCurso? categoria = null, decimal? valorMinimo = null)
        {
            var condicoes = new List<string>();
            var parametros = new DynamicParameters();

            if (!string.IsNullOrEmpty(nome))
            {
                condicoes.Add("LOWER(nome) LIKE LOWER(@Nome)");
                parametros.Add("Nome", $"%{nome}%");
            }

            if (categoria.HasValue)
            {
                condicoes.Add("categoria = @CategoriaString::categoria_curso");
                parametros.Add("CategoriaString", categoria.Value.ToString());
            }

            if (valorMinimo.HasValue)
            {
                condicoes.Add("valor >= @ValorMinimo");
                parametros.Add("ValorMinimo", valorMinimo.Value);
            }

            var whereClause = condicoes.Any() ? "WHERE " + string.Join(" AND ", condicoes) : "";

            var sql = $@"
                SELECT id, nome, descricao, data_criacao as DataCriacao, categoria, valor, carga_horaria as CargaHoraria, professor_id as ProfessorId, ativo
                FROM public.curso
                {whereClause}
                ORDER BY nome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Curso>(sql, parametros);
        }

        // Método para obter apenas cursos ativos (para vinculação conforme linha 136 do README)
        public async Task<IEnumerable<Curso>> ObterAtivos()
        {
            var sql = @"
                SELECT id, nome, descricao, data_criacao as DataCriacao, categoria, valor, carga_horaria as CargaHoraria, professor_id as ProfessorId, ativo
                FROM public.curso
                WHERE ativo = true
                ORDER BY nome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Curso>(sql);
        }
    }
}