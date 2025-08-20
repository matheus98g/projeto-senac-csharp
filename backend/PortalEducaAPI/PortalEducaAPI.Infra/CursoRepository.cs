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
    public class CursoRepository : ICursoRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public CursoRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        

        public async Task AtualizarPorId(Curso curso)
        {
            var sql = @"
                UPDATE Curso
                SET Nome = @Nome,
                    Descricao = @Descricao,
                    CategoriaCursoId = @Categoria,
                    Valor = @Valor,
                    CargaHoraria = @CargaHoraria,
                    ProfessorId = @ProfessorId,
                    Ativo = @Ativo
                WHERE Id = @Id
            ";

            var connection = _connectionFactory.CreateConnection();
            await connection.QueryFirstOrDefaultAsync(sql, curso);
        }

        public async Task<long> Cadastrar(Curso curso)
        {
            var sql = @"
                INSERT INTO Curso
                (Nome, Descricao, DataCriacao, CategoriaCursoId, Valor, CargaHoraria, ProfessorId, Ativo)
                OUTPUT INSERTED.Id
                VALUES
                (@Nome, @Descricao, @DataCriacao, @Categoria, @Valor, @CargaHoraria, @ProfessorId, @Ativo)
            ";

            var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<long>(sql, curso);
        }

        public async Task DeletarPorId(long id)
        {
            var sql = @"DELETE FROM Curso WHERE Id = @Id";

            var connection = _connectionFactory.CreateConnection();
            await connection.QueryFirstOrDefaultAsync(sql, new { Id = id });
        }

        
        async Task<Curso> ICursoRepository.ObterDetalhadoPorId(long id)
        {
            var sql = @"
            SELECT 
                c.Id, 
                c.Nome, 
                c.Descricao, 
                c.DataCriacao, 
                cc.Id AS Categoria, 
                c.Valor, 
                c.CargaHoraria, 
                c.ProfessorId, 
                c.Ativo
            FROM Curso c
            INNER JOIN CategoriaCurso cc ON cc.Id = c.CategoriaCursoId
            WHERE c.Id = @Id
            ";

            var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Curso>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Curso>> ObterTodos()
        {
            var sql = @"
                SELECT Id, Nome, Descricao, DataCriacao, CategoriaCursoId, Valor, CargaHoraria, ProfessorId, Ativo
                FROM Curso
            ";

            var connection = _connectionFactory.CreateConnection();
            return (IEnumerable<Curso>)await connection.QueryAsync<Curso>(sql);
        }

    }

}