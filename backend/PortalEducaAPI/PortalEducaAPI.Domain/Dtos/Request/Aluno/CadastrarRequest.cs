﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortalEducaAPI.Domain.Dtos.Request.Aluno
{
    public class CadastrarRequest
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Sobrenome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Responsavel { get; set; }
        public DateTime DataNascimento { get; set; }
    }
}
