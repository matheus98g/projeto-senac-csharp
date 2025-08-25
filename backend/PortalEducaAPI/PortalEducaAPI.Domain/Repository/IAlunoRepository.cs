using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Models;

namespace PortalEducaAPI.Domain.Repository
{
    public interface IAlunoRepository
    {
        Task<long> Cadastrar(Aluno aluno);
        Task AtualizarPorId(Aluno aluno);
        Task DeletarPorId(long id);
        Task<Aluno> ObterDetalhadoPorId(long id);
        Task<IEnumerable<Aluno>> ObterTodos();
        
        // Métodos de busca conforme README linha 91
        Task<IEnumerable<Aluno>> BuscarPorNome(string nome);
        Task<IEnumerable<Aluno>> ObterAtivos();
    }
}
