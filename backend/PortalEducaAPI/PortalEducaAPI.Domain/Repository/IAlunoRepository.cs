using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortalEducaAPI.Domain.Repository
{
    public interface IAlunoRepository
    {

        Task<Jogos> ObterDetalhadoPorId(long id);

        Task DeletarPorId(long id);
        Task AtualizarPorId(Jogos jogo);

        Task<IEnumerable<Jogos>> ObterTodos();

        Task<long> Cadastrar(Jogos jogo);
        Task DevolverJogo(Jogos jogo);
        Task AlugarJogo(Jogos jogo);
    }
}
