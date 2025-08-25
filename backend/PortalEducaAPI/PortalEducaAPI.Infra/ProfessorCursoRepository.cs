using Dapper;
using PortalEducaAPI.Domain.Models;
using PortalEducaAPI.Domain.Repository;
using PortalEducaAPI.Infra.DatabaseConfiguration;

namespace PortalEducaAPI.Infra
{
    public class ProfessorCursoRepository : IProfessorCursoRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public ProfessorCursoRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<long> VincularProfessorACurso(long professorId, long cursoId)
        {
            // Verificar se ambos estão ativos (conforme linha 136 do README)
            var validacaoSql = @"
                SELECT 
                    (SELECT ativo FROM public.professor WHERE id = @ProfessorId) as ProfessorAtivo,
                    (SELECT ativo FROM public.curso WHERE id = @CursoId) as CursoAtivo
            ";

            using var connection = _connectionFactory.CreateConnection();
            
            var validacao = await connection.QueryFirstOrDefaultAsync<dynamic>(validacaoSql, new { ProfessorId = professorId, CursoId = cursoId });
            
            if (validacao?.ProfessorAtivo != true || validacao?.CursoAtivo != true)
            {
                throw new InvalidOperationException("Apenas professores e cursos ativos podem ser vinculados.");
            }

            var sql = @"
                INSERT INTO public.professor_curso (professor_id, curso_id, data_vinculacao, ativo)
                VALUES (@ProfessorId, @CursoId, @DataVinculacao, @Ativo)
                ON CONFLICT (professor_id, curso_id) 
                DO UPDATE SET ativo = @Ativo, data_vinculacao = @DataVinculacao
                RETURNING id
            ";

            return await connection.QueryFirstOrDefaultAsync<long>(sql, new 
            { 
                ProfessorId = professorId, 
                CursoId = cursoId, 
                DataVinculacao = DateTime.Now.Date,
                Ativo = true 
            });
        }

        public async Task DesabilitarVinculo(long professorId, long cursoId)
        {
            var sql = @"
                UPDATE public.professor_curso
                SET ativo = false
                WHERE professor_id = @ProfessorId AND curso_id = @CursoId
            ";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, new { ProfessorId = professorId, CursoId = cursoId });
        }

        public async Task<bool> VinculoExiste(long professorId, long cursoId)
        {
            var sql = @"
                SELECT COUNT(1)
                FROM public.professor_curso
                WHERE professor_id = @ProfessorId AND curso_id = @CursoId AND ativo = true
            ";

            using var connection = _connectionFactory.CreateConnection();
            var count = await connection.QueryFirstOrDefaultAsync<int>(sql, new { ProfessorId = professorId, CursoId = cursoId });
            return count > 0;
        }

        public async Task<IEnumerable<ProfessorCurso>> ObterVinculosPorProfessor(long professorId)
        {
            var sql = @"
                SELECT id, professor_id as ProfessorId, curso_id as CursoId, data_vinculacao as DataVinculacao, ativo
                FROM public.professor_curso
                WHERE professor_id = @ProfessorId AND ativo = true
                ORDER BY data_vinculacao DESC
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ProfessorCurso>(sql, new { ProfessorId = professorId });
        }

        public async Task<IEnumerable<ProfessorCurso>> ObterVinculosPorCurso(long cursoId)
        {
            var sql = @"
                SELECT id, professor_id as ProfessorId, curso_id as CursoId, data_vinculacao as DataVinculacao, ativo
                FROM public.professor_curso
                WHERE curso_id = @CursoId AND ativo = true
                ORDER BY data_vinculacao DESC
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ProfessorCurso>(sql, new { CursoId = cursoId });
        }

        public async Task<IEnumerable<Curso>> ObterCursosDoProfessor(long professorId)
        {
            var sql = @"
                SELECT c.id, c.nome, c.descricao, c.data_criacao as DataCriacao, c.categoria, c.valor, 
                       c.carga_horaria as CargaHoraria, c.professor_id as ProfessorId, c.ativo
                FROM public.curso c
                INNER JOIN public.professor_curso pc ON pc.curso_id = c.id
                WHERE pc.professor_id = @ProfessorId AND pc.ativo = true AND c.ativo = true
                ORDER BY c.nome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Curso>(sql, new { ProfessorId = professorId });
        }

        public async Task<IEnumerable<Professor>> ObterProfessoresAtivosParaCurso(long cursoId)
        {
            var sql = @"
                SELECT p.id, p.nome, p.sobrenome, p.data_nascimento as DataDeNascimento, p.email, p.telefone, 
                       p.data_contratacao as DataContratacao, p.formacao, p.ativo
                FROM public.professor p
                INNER JOIN public.professor_curso pc ON pc.professor_id = p.id
                WHERE pc.curso_id = @CursoId AND pc.ativo = true AND p.ativo = true
                ORDER BY p.nome, p.sobrenome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Professor>(sql, new { CursoId = cursoId });
        }
    }
}
