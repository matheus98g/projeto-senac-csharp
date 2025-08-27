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
            var curso = new Curso
            {
                Nome = cadastrarCursoRequest.Nome,
                Descricao = cadastrarCursoRequest.Descricao,
                CargaHoraria = cadastrarCursoRequest.CargaHoraria,
                Valor = cadastrarCursoRequest.Valor,
                Categoria = cadastrarCursoRequest.Categoria,
                Ativo = cadastrarCursoRequest.Ativo,
                DataCriacao = cadastrarCursoRequest.DataCriacao,
                ProfessorId = cadastrarCursoRequest.ProfessorId
            };

            long idResponse = await _cursoRepository.Cadastrar(curso);

            return new CadastrarCursoResponse
            {
                Id = idResponse,
            };
        }

        public async Task AtualizarPorId(long id, AtualizarCursoRequest atualizarCursoRequest)
        {
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
            curso.Categoria = atualizarCursoRequest.Categoria;

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
                Id = curso.Id,
                Descricao = curso.Descricao,
                Valor = curso.Valor,
                DataCriacao = curso.DataCriacao,
                ProfessorId = curso.ProfessorId,
                CargaHoraria = curso.CargaHoraria,
                Categoria = curso.Categoria,
                Ativo = curso.Ativo
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
