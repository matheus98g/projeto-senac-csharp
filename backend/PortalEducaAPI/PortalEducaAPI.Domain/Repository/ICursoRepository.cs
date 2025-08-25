using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Models;

namespace PortalEducaAPI.Domain.Repository
{
    public interface ICursoRepository
    {
        Task<long> Cadastrar(Curso curso);
        Task AtualizarPorId(Curso curso);
        Task DeletarPorId(long id);
        Task<Curso> ObterDetalhadoPorId(long id);
        Task<IEnumerable<Curso>> ObterTodos();
        
        // Métodos de busca e filtros conforme README linha 99
        Task<IEnumerable<Curso>> BuscarPorNome(string nome);
        Task<IEnumerable<Curso>> BuscarPorCategoria(CategoriaCurso categoria);
        Task<IEnumerable<Curso>> BuscarPorValorMinimo(decimal valorMinimo);
        Task<IEnumerable<Curso>> BuscarComFiltros(string? nome = null, CategoriaCurso? categoria = null, decimal? valorMinimo = null);
        Task<IEnumerable<Curso>> ObterAtivos();
    }
}