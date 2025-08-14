using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using PortalEducaAPI.Domain.Dtos;
using PortalEducaAPI.Domain.Dtos.Request.Curso;
using PortalEducaAPI.Domain.Service;

namespace PortalEducaAPI.Controllers
{

        [ApiController]
        [Route("Curso")]
        public class CursoController : Controller
        {
            private readonly ICursoService _CursoService;

            public CursoController(ICursoService CursoService)
            {
            _CursoService = CursoService;
            }

            [HttpGet]
            public async Task<IActionResult> ObterTodos()
            {
                var CursoResponse = await _CursoService.ObterTodos();

                return Ok(CursoResponse);
            }

            [HttpGet("{id}")]
            public async Task<IActionResult> ObterDetalhadoPorId([FromRoute] long id)
            {
                try
                {
                    var CursoDetalhadoResponse = await _CursoService.ObterDetalhadoPorId(id);

                    return Ok(CursoDetalhadoResponse);
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
            public async Task<IActionResult> Cadastrar([FromBody] CadastrarCursoRequest cadastrarRequest)
            {
                try
                {
                    var cadastrarResponse = await _CursoService.Cadastrar(cadastrarRequest);

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
                    await _CursoService.DeletarPorId(id);

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
            public async Task<IActionResult> EditarPorID([FromRoute] long id, [FromBody] AtualizarCursoRequest adicionarRequest)
            {
                try
                {
                    await _CursoService.AtualizarPorId(id, adicionarRequest);
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





