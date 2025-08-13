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
    public class ProfessorService : IProfessorService
    {
        private readonly IProfessorRepository _professorRepository;

        public ProfessorService(IProfessorRepository professorRepository)
        {
            _professorRepository = professorRepository;
        }

        public async Task<CadastrarResponse> Cadastrar(CadastrarRequest cadastrarRequest)
        {
            bool formacaoValida = Enum.TryParse(cadastrarRequest.Categoria, ignoreCase: true, out FormacaoProfessor formacao);

            if (!formacaoValida)
            {
                throw new Exception($"A formação '{cadastrarRequest.Categoria}' é inválida.");
            }

            var professor = new Professor
            {
                Nome = cadastrarRequest.Nome,
                Sobrenome = cadastrarRequest.Sobrenome,
                Telefone = cadastrarRequest.Telefone,
                Email = cadastrarRequest.Email,
                DataContratacao = DateTime.Now,
                Formacao = formacao,
                Ativo = true
            };

            long idResponse = await _professorRepository.Cadastrar(professor);

            return new CadastrarResponse
            {
                Id = idResponse,
            };
        }

        public async Task AtualizarPorId(long id, AtualizarRequest atualizarRequest)
        {
            var formacoesValidas = Enum.GetNames(typeof(FormacaoProfessor));

            if (!formacoesValidas.Contains(atualizarRequest.Categoria, StringComparer.OrdinalIgnoreCase))
            {
                throw new Exception($"A formação '{atualizarRequest.Categoria}' é inválida.");
            }

            var professor = await _professorRepository.ObterDetalhadoPorId(id);

            if (professor == null)
            {
                throw new Exception($"Não foi possível encontrar o professor com ID {id}.");
            }

            professor.Nome = atualizarRequest.Nome;
            professor.Sobrenome = atualizarRequest.Sobrenome;
            professor.Telefone = atualizarRequest.Telefone;
            professor.Email = atualizarRequest.Email;
            professor.Formacao = Enum.Parse<FormacaoProfessor>(atualizarRequest.Categoria, ignoreCase: true);

            await _professorRepository.AtualizarPorId(professor);
        }

        public async Task DeletarPorId(long id)
        {
            var professor = await _professorRepository.ObterDetalhadoPorId(id);

            if (professor == null)
            {
                throw new Exception($"Não foi encontrado um professor com o ID {id}.");
            }

            await _professorRepository.DeletarPorId(id);
        }

        public async Task<IEnumerable<ObterTodosResponse>> ObterTodos()
        {
            var professores = await _professorRepository.ObterTodos();

            return professores.Select(p => new ObterTodosResponse
            {
                Id = p.Id,
                Nome = p.Nome
            });
        }

        public async Task<ObterDetalhadoPorIdResponse> ObterDetalhadoPorId(long id)
        {
            var professor = await _professorRepository.ObterDetalhadoPorId(id);

            if (professor == null)
                throw new KeyNotFoundException($"Professor com ID {id} não encontrado.");

            return new ObterDetalhadoPorIdResponse
            {
                Id = professor.Id,
                Nome = professor.Nome,
                Sobrenome = professor.Sobrenome,
                Telefone = professor.Telefone,
                Email = professor.Email,
                Formacao = professor.Formacao.ToString(),
                DataContratacao = professor.DataContratacao,
                Ativo = professor.Ativo
            };
        }
    }
}
