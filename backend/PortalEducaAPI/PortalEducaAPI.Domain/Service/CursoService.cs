using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Dtos.Request.Aluno;
using PortalEducaAPI.Domain.Dtos.Request.Curso;
using PortalEducaAPI.Domain.Dtos.Response.Aluno;
using PortalEducaAPI.Domain.Dtos.Response.Curso;
using PortalEducaAPI.Domain.Models;
using PortalEducaAPI.Domain.Repository;

namespace PortalEducaAPI.Domain.Service
{
    public class CursoService : ICursoService
    {
        private readonly ICursoRepository _cursoRepository;

        public CursoService(ICursoRepository cursoRepository)
        {
            _cursoRepository = cursoRepository;
        }

        public async Task<CadastrarCursoResponse> Cadastrar(CadastrarCursoRequest cadastrarCursoRequest)
        {
            bool categoriaValida = Enum.TryParse(cadastrarCursoRequest.Categoria, ignoreCase: true, out CategoriaCurso categoria);

            if (!categoriaValida)
            {
                throw new Exception($"A categoria '{cadastrarCursoRequest.Categoria}' é inválida.");
            }

            var curso = new Curso
            {
                Nome = cadastrarCursoRequest.Nome,
                Descricao = cadastrarCursoRequest.Descricao,
                CargaHoraria = cadastrarCursoRequest.CargaHoraria,
                Valor = cadastrarCursoRequest.Valor,
                Categoria = categoria,
                Ativo = true,
                DataCriacao = DateTime.Now
            };

            long idResponse = await _cursoRepository.Cadastrar(curso);

            return new CadastrarCursoResponse
            {
                Id = idResponse,
            };
        }

        public async Task AtualizarPorId(long id, AtualizarCursoRequest atualizarCursoRequest)
        {
            var categoriasValidas = Enum.GetNames(typeof(CategoriaCurso));

            if (!categoriasValidas.Contains(atualizarCursoRequest.Categoria, StringComparer.OrdinalIgnoreCase))
            {
                throw new Exception($"A categoria '{atualizarCursoRequest.Categoria}' é inválida.");
            }

            var curso = await _cursoRepository.ObterDetalhadoPorId(id);

            if (curso == null)
            {
                throw new Exception($"Não foi possível encontrar o curso com ID {id}.");
            }

            curso.Valor = atualizarCursoRequest.Valor;
            curso.CargaHoraria = atualizarCursoRequest.CargaHoraria;
            curso.Ativo = atualizarCursoRequest.Ativo;
            curso.ProfessorId = atualizarCursoRequest.ProfessorId;
            curso.Descricao = atualizarCursoRequest.Descricao;
            curso.Categoria = Enum.Parse<CategoriaCurso>(atualizarCursoRequest.Categoria, ignoreCase: true);

            await _cursoRepository.AtualizarPorId(curso);
        }

        public async Task DeletarPorId(long id)
        {
            var curso = await _cursoRepository.ObterDetalhadoPorId(id);

            if (curso == null)
            {
                throw new Exception($"Não foi encontrado um curso com o ID {id}.");
            }

            await _cursoRepository.DeletarPorId(id);
        }

        public async Task<IEnumerable<ObterTodosCursoResponse>> ObterTodos()
        {
            var cursos = await _cursoRepository.ObterTodos();

            var response = cursos.Select(curso => new ObterTodosCursoResponse
            {
                Nome = curso.Nome,
                Id = curso.Id
            });

            return response;
        }

        public async Task<ObterCursoDetalhadoPorIdResponse> ObterDetalhadoPorId(long id)
        {
            var curso = await _cursoRepository.ObterDetalhadoPorId(id);

            if (curso == null)
                throw new KeyNotFoundException($"Curso com ID {id} não encontrado.");

            return new ObterCursoDetalhadoPorIdResponse
            {
                Id = curso.Id,
                Nome = curso.Nome,
                Descricao = curso.Descricao,
                Telefone = curso.Telefone,
                Valor = curso.Valor,
                Categoria = curso.Categoria.ToString(),
                DataCriacao = curso.DataCriacao,
                CargaHoraria = curso.CargaHoraria,
                ProfessorId = curso.ProfessorId,
                Ativo = curso.Ativo
            };
        }

    }
}
