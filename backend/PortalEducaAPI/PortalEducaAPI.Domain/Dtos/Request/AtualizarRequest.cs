using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortalEducaAPI.Domain.Dtos.Request
{
    public class AtualizarRequest
    {
        public string Email { get; set; }
        public string Telefone { get; set; }
        public bool Ativo { get; set; }
    }
}
