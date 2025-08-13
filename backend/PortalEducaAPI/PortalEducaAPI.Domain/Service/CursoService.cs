using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Dtos.Request;
using PortalEducaAPI.Domain.Dtos.Response;
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

        public async Task<CadastrarResponse> Cadastrar(CadastrarCursoRequest cadastrarCursoRequest)
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
                Telefone = cadastrarCursoRequest.Telefone,
                Valor = cadastrarCursoRequest.Valor,
                DataEntrega = cadastrarCursoRequest.DataEntrega,
                Categoria = categoria,
                Ativo = true,
                DataCriacao = DateTime.Now
            };

            long idResponse = await _cursoRepository.Cadastrar(curso);

            return new CadastrarResponse
            {
                Id = idResponse,
            };
        }

        public async Task AtualizarPorId(long id, AtualizarRequest atualizarRequest)
        {
            var categoriasValidas = Enum.GetNames(typeof(CategoriaCurso));

            if (!categoriasValidas.Contains(atualizarRequest.Categoria, StringComparer.OrdinalIgnoreCase))
            {
                throw new Exception($"A categoria '{atualizarRequest.Categoria}' é inválida.");
            }

            var curso = await _cursoRepository.ObterDetalhadoPorId(id);

            if (curso == null)
            {
                throw new Exception($"Não foi possível encontrar o curso com ID {id}.");
            }

            curso.Nome = atualizarRequest.Nome;
            curso.Descricao = atualizarRequest.Descricao;
            curso.Categoria = Enum.Parse<CategoriaCurso>(atualizarRequest.Categoria, ignoreCase: true);

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

        public async Task<IEnumerable<ObterTodosResponse>> ObterTodos()
        {
            var cursos = await _cursoRepository.ObterTodos();

            var response = cursos.Select(curso => new ObterTodosResponse
            {
                Nome = curso.Nome,
                Id = curso.Id
            });

            return response;
        }

        public async Task<ObterDetalhadoPorIdResponse> ObterDetalhadoPorId(long id)
        {
            var curso = await _cursoRepository.ObterDetalhadoPorId(id);

            if (curso == null)
                throw new KeyNotFoundException($"Curso com ID {id} não encontrado.");

            return new ObterDetalhadoPorIdResponse
            {
                Id = curso.Id,
                Nome = curso.Nome,
                Descricao = curso.Descricao,
                Telefone = curso.Telefone,
                Valor = curso.Valor,
                Categoria = curso.Categoria.ToString(),
                DataEntrega = curso.DataEntrega,
                Ativo = curso.Ativo
            };
        }

    }
}
