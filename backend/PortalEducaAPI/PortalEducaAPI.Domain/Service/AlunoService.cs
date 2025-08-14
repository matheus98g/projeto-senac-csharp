using PortalEducaAPI.Domain.Dtos.Request.Aluno;
using PortalEducaAPI.Domain.Dtos.Response.Aluno;
using PortalEducaAPI.Domain.Models;
using PortalEducaAPI.Domain.Repository;
using PortalEducaAPI.Domain.Service.PortalEducaAPI.Domain.Service;

namespace PortalEducaAPI.Domain.Service
{
    public class AlunoService : IAlunoService
    {
        private readonly IAlunoRepository _alunoRepository;

        public AlunoService(IAlunoRepository alunoRepository)
        {
            _alunoRepository = alunoRepository;
        }

        public async Task<CadastrarResponse> Cadastrar(CadastrarRequest request)
        {
            var aluno = new Aluno
            {
                Id = request.Id,
                Nome = request.Nome,
                Sobrenome = request.Sobrenome,
                Email = request.Email,
                Telefone = request.Telefone,
                DataNascimento = request.DataNascimento,
                Matricula = DateTime.Now,
                Ativo = true
            };

            long id = await _alunoRepository.Cadastrar(aluno);

            return new CadastrarResponse
            {
                Id = id
            };
        }

        public async Task AtualizarPorId(long id, AtualizarRequest request)
        {
            var aluno = await _alunoRepository.ObterDetalhadoPorId(id);

            if (aluno == null)
                throw new Exception($"Aluno com ID {id} não encontrado.");

            aluno.Email = request.Email;
            aluno.Telefone = request.Telefone;
            aluno.Ativo = request.Ativo;

            await _alunoRepository.AtualizarPorId(aluno);
        }

        public async Task DeletarPorId(long id)
        {
            var aluno = await _alunoRepository.ObterDetalhadoPorId(id);

            if (aluno == null)
                throw new Exception($"Aluno com ID {id} não encontrado.");

            await _alunoRepository.DeletarPorId(id);
        }

        public async Task<IEnumerable<ObterTodosResponse>> ObterTodos()
        {
            var alunos = await _alunoRepository.ObterTodos();

            return alunos.Select(x => new ObterTodosResponse
            {
                Id = x.Id,
                Nome = $"{x.Nome} {x.Sobrenome}"
            });
        }

        public async Task<ObterDetalhadoPorIdResponse> ObterDetalhadoPorId(long id)
        {
            var aluno = await _alunoRepository.ObterDetalhadoPorId(id);

            if (aluno == null)
                throw new Exception($"Aluno com ID {id} não encontrado.");

            return new ObterDetalhadoPorIdResponse
            {
                Id = aluno.Id,
                Nome = aluno.Nome,
                Sobrenome = aluno.Sobrenome,
                Email = aluno.Email,
                Telefone = aluno.Telefone,
                DataNascimento = aluno.DataNascimento,
                Matricula = aluno.Matricula,
                Ativo = aluno.Ativo
            };
        }
    }
}
