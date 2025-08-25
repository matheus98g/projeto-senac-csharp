using Dapper;
using PortalEducaAPI.Domain.Models;
using PortalEducaAPI.Domain.Repository;
using PortalEducaAPI.Infra.DatabaseConfiguration;

namespace PortalEducaAPI.Infra
{
    public class AlunoCursoRepository : IAlunoCursoRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public AlunoCursoRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<long> VincularAlunoACurso(long alunoId, long cursoId)
        {
            // Verificar se ambos estão ativos (conforme linha 136 do README)
            var validacaoSql = @"
                SELECT 
                    (SELECT ativo FROM public.aluno WHERE id = @AlunoId) as AlunoAtivo,
                    (SELECT ativo FROM public.curso WHERE id = @CursoId) as CursoAtivo
            ";

            using var connection = _connectionFactory.CreateConnection();
            
            var validacao = await connection.QueryFirstOrDefaultAsync<dynamic>(validacaoSql, new { AlunoId = alunoId, CursoId = cursoId });
            
            if (validacao?.AlunoAtivo != true || validacao?.CursoAtivo != true)
            {
                throw new InvalidOperationException("Apenas alunos e cursos ativos podem ser vinculados.");
            }

            var sql = @"
                INSERT INTO public.aluno_curso (aluno_id, curso_id, data_matricula_curso, ativo)
                VALUES (@AlunoId, @CursoId, @DataMatriculaCurso, @Ativo)
                ON CONFLICT (aluno_id, curso_id) 
                DO UPDATE SET ativo = @Ativo, data_matricula_curso = @DataMatriculaCurso
                RETURNING id
            ";

            return await connection.QueryFirstOrDefaultAsync<long>(sql, new 
            { 
                AlunoId = alunoId, 
                CursoId = cursoId, 
                DataMatriculaCurso = DateTime.Now.Date,
                Ativo = true 
            });
        }

        public async Task DesabilitarVinculo(long alunoId, long cursoId)
        {
            var sql = @"
                UPDATE public.aluno_curso
                SET ativo = false
                WHERE aluno_id = @AlunoId AND curso_id = @CursoId
            ";

            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, new { AlunoId = alunoId, CursoId = cursoId });
        }

        public async Task<bool> VinculoExiste(long alunoId, long cursoId)
        {
            var sql = @"
                SELECT COUNT(1)
                FROM public.aluno_curso
                WHERE aluno_id = @AlunoId AND curso_id = @CursoId AND ativo = true
            ";

            using var connection = _connectionFactory.CreateConnection();
            var count = await connection.QueryFirstOrDefaultAsync<int>(sql, new { AlunoId = alunoId, CursoId = cursoId });
            return count > 0;
        }

        public async Task<IEnumerable<AlunoCurso>> ObterVinculosPorAluno(long alunoId)
        {
            var sql = @"
                SELECT id, aluno_id as AlunoId, curso_id as CursoId, data_matricula_curso as DataMatriculaCurso, ativo
                FROM public.aluno_curso
                WHERE aluno_id = @AlunoId AND ativo = true
                ORDER BY data_matricula_curso DESC
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<AlunoCurso>(sql, new { AlunoId = alunoId });
        }

        public async Task<IEnumerable<AlunoCurso>> ObterVinculosPorCurso(long cursoId)
        {
            var sql = @"
                SELECT id, aluno_id as AlunoId, curso_id as CursoId, data_matricula_curso as DataMatriculaCurso, ativo
                FROM public.aluno_curso
                WHERE curso_id = @CursoId AND ativo = true
                ORDER BY data_matricula_curso DESC
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<AlunoCurso>(sql, new { CursoId = cursoId });
        }

        public async Task<IEnumerable<Curso>> ObterCursosDoAluno(long alunoId)
        {
            var sql = @"
                SELECT c.id, c.nome, c.descricao, c.data_criacao as DataCriacao, c.categoria, c.valor, 
                       c.carga_horaria as CargaHoraria, c.professor_id as ProfessorId, c.ativo
                FROM public.curso c
                INNER JOIN public.aluno_curso ac ON ac.curso_id = c.id
                WHERE ac.aluno_id = @AlunoId AND ac.ativo = true AND c.ativo = true
                ORDER BY c.nome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Curso>(sql, new { AlunoId = alunoId });
        }

        public async Task<IEnumerable<Aluno>> ObterAlunosAtivosParaCurso(long cursoId)
        {
            var sql = @"
                SELECT a.id, a.nome, a.sobrenome, a.data_nascimento as DataDeNascimento, a.email, a.telefone, 
                       a.data_matricula as DataMatricula, a.ativo
                FROM public.aluno a
                INNER JOIN public.aluno_curso ac ON ac.aluno_id = a.id
                WHERE ac.curso_id = @CursoId AND ac.ativo = true AND a.ativo = true
                ORDER BY a.nome, a.sobrenome
            ";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Aluno>(sql, new { CursoId = cursoId });
        }
    }
}
