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
            Console.WriteLine($"Validando aluno {alunoId} e curso {cursoId}");
            


            using var connection = _connectionFactory.CreateConnection();
            
            // Primeiro, vamos verificar se o aluno existe e está ativo
            var alunoSql = "SELECT id, nome, ativo FROM public.aluno WHERE id = @AlunoId";
            var aluno = await connection.QueryFirstOrDefaultAsync<dynamic>(alunoSql, new { AlunoId = alunoId });
            
            if (aluno == null)
            {
                var mensagem = $"Aluno {alunoId} não encontrado";
                Console.WriteLine(mensagem);
                throw new InvalidOperationException(mensagem);
            }
            
            Console.WriteLine($"Aluno encontrado: {aluno.nome} (ID: {aluno.id}) ativo: {aluno.ativo} (tipo: {aluno.ativo?.GetType()})");
            
            // Verificar se o curso existe e está ativo
            var cursoSql = "SELECT id, nome, ativo FROM public.curso WHERE id = @CursoId";
            var curso = await connection.QueryFirstOrDefaultAsync<dynamic>(cursoSql, new { CursoId = cursoId });
            
            if (curso == null)
            {
                var mensagem = $"Curso {cursoId} não encontrado";
                Console.WriteLine(mensagem);
                throw new InvalidOperationException(mensagem);
            }
            
            Console.WriteLine($"Curso encontrado: {curso.nome} (ID: {curso.id}) ativo: {curso.ativo} (tipo: {curso.ativo?.GetType()})");
            
            // Verificar se ambos estão ativos
            var alunoAtivo = Convert.ToBoolean(aluno.ativo);
            var cursoAtivo = Convert.ToBoolean(curso.ativo);
            
            Console.WriteLine($"Aluno ativo convertido: {alunoAtivo}");
            Console.WriteLine($"Curso ativo convertido: {cursoAtivo}");
            
            if (!alunoAtivo || !cursoAtivo)
            {
                var mensagem = $"Apenas alunos e cursos ativos podem ser vinculados. Aluno {aluno.nome} (ID: {aluno.id}) ativo: {aluno.ativo}, Curso {curso.nome} (ID: {curso.id}) ativo: {curso.ativo}";
                Console.WriteLine(mensagem);
                throw new InvalidOperationException(mensagem);
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
