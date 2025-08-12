using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortalEducaAPI.Domain.Dtos.Request
{
    public class CadastrarRequest
    {
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public bool Disponivel { get; set; }
        public string Categoria { get; set; }
        public string Responsavel { get; set; }
        public DateTime DataEntrega { get; set; }
    }
}
