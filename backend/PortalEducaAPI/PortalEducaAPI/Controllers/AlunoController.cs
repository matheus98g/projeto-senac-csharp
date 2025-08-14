using Microsoft.AspNetCore.Mvc;
using PortalEducaAPI.Domain.Dtos;
using PortalEducaAPI.Domain.Dtos.Request.Aluno;
using PortalEducaAPI.Domain.Service.PortalEducaAPI.Domain.Service;

namespace PortalEducaAPI.Controllers
{
   

        [ApiController]
        [Route("Aluno")]
        public class AlunoController: Controller 
        {
            private readonly IAlunoService _AlunoService;

            public AlunoController(IAlunoService AlunoService)
            {
            _AlunoService = AlunoService;
            }

            [HttpGet]
            public async Task<IActionResult> ObterTodos()
            {
                var AlunosResponse = await _AlunoService.ObterTodos();

                return Ok(AlunosResponse);
            }

            [HttpGet("{id}")]
            public async Task<IActionResult> ObterDetalhadoPorId([FromRoute] long id)
            {
                try
                {
                    var AlunoDetalhadoResponse = await _AlunoService.ObterDetalhadoPorId(id);

                    return Ok(AlunoDetalhadoResponse);
                }
                catch (Exception ex)
                {
                    var erroResponse = new ErroResponse
                    {
                        Mensagem = ex.Message
                    };

                    return NotFound(erroResponse);
                }
            }

            [HttpPost]
            public async Task<IActionResult> Cadastrar([FromBody] CadastrarRequest cadastrarRequest)
            {
                try
                {
                    var cadastrarResponse = await _AlunoService.Cadastrar(cadastrarRequest);

                    return Ok(cadastrarResponse);
                }
                catch (Exception ex)
                {
                    var erroResponse = new ErroResponse
                    {
                        Mensagem = ex.Message
                    };

                    return BadRequest(erroResponse);
                }
            }

            [HttpDelete("{id}")]
            public async Task<IActionResult> DeletarPorId([FromRoute] long id)
            {
                try
                {
                    await _AlunoService.DeletarPorId(id);

                    return Ok();
                }
                catch (Exception ex)
                {
                    var erroResponse = new ErroResponse
                    {
                        Mensagem = ex.Message
                    };

                    return BadRequest(erroResponse);
                }
            }
            [HttpPut("{id}")]
            public async Task<IActionResult> EditarPorID([FromRoute] long id, [FromBody] AtualizarRequest adicionarRequest)
            {
                try
                {
                    await _AlunoService.AtualizarPorId(id, adicionarRequest);
                    return Ok();
                }
                catch (Exception ex)
                {
                    var erroResponse = new ErroResponse
                    {
                        Mensagem = ex.Message
                    };
                    return BadRequest(erroResponse);
                }
            }
           

        }
    }



