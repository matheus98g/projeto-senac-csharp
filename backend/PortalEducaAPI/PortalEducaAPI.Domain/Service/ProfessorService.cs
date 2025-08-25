using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Dtos.Request.Professor;
using PortalEducaAPI.Domain.Dtos.Response.Professor;
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

        public async Task<CadastrarProfessorResponse> Cadastrar(CadastrarProfessorRequest cadastrarRequest)
        {
            bool formacaoValida = Enum.TryParse(cadastrarRequest.Formacao, ignoreCase: true, out FormacaoProfessor formacao);

            if (!formacaoValida)
                throw new Exception($"A formação '{cadastrarRequest.Formacao}' é inválida.");

            var professor = new Professor
            {
                Nome = cadastrarRequest.Nome,
                Sobrenome = cadastrarRequest.Sobrenome,
                Telefone = cadastrarRequest.Telefone,
                Email = cadastrarRequest.Email,
                DataContratacao = DateTime.Now,
                Formacao = formacao,
                DataDeNascimento = cadastrarRequest.DataDeNascimento,
                Ativo = true
            };

            long idResponse = await _professorRepository.Cadastrar(professor);

            return new CadastrarProfessorResponse
            {
                Id = idResponse
            };
        }

        public async Task AtualizarPorId(long id, AtualizarProfessorRequest atualizarRequest)
        {
            var formacoesValidas = Enum.GetNames(typeof(FormacaoProfessor));

            if (!formacoesValidas.Contains(atualizarRequest.Formacao, StringComparer.OrdinalIgnoreCase))
                throw new Exception($"A formação '{atualizarRequest.Formacao}' é inválida.");

            var professor = await _professorRepository.ObterDetalhadoPorId(id);

            if (professor == null)
                throw new Exception($"Não foi possível encontrar o professor com ID {id}.");

            professor.Email = atualizarRequest.Email;
            professor.Ativo = atualizarRequest.Ativo;
            professor.Telefone = atualizarRequest.Telefone;
            professor.Formacao = Enum.Parse<FormacaoProfessor>(atualizarRequest.Formacao, ignoreCase: true);

            await _professorRepository.AtualizarPorId(professor);
        }

        public async Task DeletarPorId(long id)
        {
            var professor = await _professorRepository.ObterDetalhadoPorId(id);

            if (professor == null)
                throw new Exception($"Não foi encontrado um professor com o ID {id}.");

            bool possuiCursos = await _professorRepository.ProfessorPossuiCursosVinculados(id);

            if (possuiCursos)
                throw new Exception("Não é possível excluir o professor, pois ele está vinculado a um ou mais cursos.");

            await _professorRepository.DeletarPorId(id);

        }

        public async Task<IEnumerable<ObterTodosProfessorResponse>> ObterTodos()
        {
            var professores = await _professorRepository.ObterTodos();

            return professores.Select(p => new ObterTodosProfessorResponse
            {
                Id = p.Id,
                Nome = p.Nome
            });
        }

        public async Task<ObterProfessorDetalhadoPorIdResponse> ObterDetalhadoPorId(long id)
        {
            var professor = await _professorRepository.ObterDetalhadoPorId(id);

            if (professor == null)
                throw new KeyNotFoundException($"Professor com ID {id} não encontrado.");

            return new ObterProfessorDetalhadoPorIdResponse
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
