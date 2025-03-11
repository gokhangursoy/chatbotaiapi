using webapi.Services;
using webapi.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controller;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly AIService _aiService;

    public ChatController(AIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost]
    public async Task<IActionResult> PostChat([FromBody] ChatRequestVM chatRequest, CancellationToken cancellationToken)
    {
        await _aiService.GetMessageStreamAsync(chatRequest.Prompt, chatRequest.ConnectionId, cancellationToken);
        return Ok();
    }
}