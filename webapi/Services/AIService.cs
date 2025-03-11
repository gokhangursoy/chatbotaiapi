using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.AI;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel;
using webapi.Hubs;

namespace webapi.Services;

public class AIService(IHubContext<AIHub> hubContext, IChatClient chatClientService, Kernel kernel)
{
    public async Task GetMessageStreamAsync(string prompt, string connectionId, CancellationToken? cancellationToken = default!)
    {
        try
        {
            var history = HistoryService.GetChatHistory(connectionId);
            history.AddSystemMessage("Sen, Türkçe konuşan bir yardımcı olarak görev yapacaksın. Lütfen tüm yanıtlarını sadece Türkçe ver.");
            history.AddUserMessage(prompt);

            string responseContent = "";
            await foreach (var response in chatClientService.GetStreamingResponseAsync(ConvertChatHistoryToChatMessages(history), null, (CancellationToken)cancellationToken))
            {
                cancellationToken?.ThrowIfCancellationRequested();

                await hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", response.ToString());
                responseContent += response.ToString();
            }
            history.AddAssistantMessage(responseContent);
        }
        catch (OperationCanceledException)
        {
            // İşlem iptal edildiğinde yapılacak işlemler.
            // İsterseniz burada istemciye iptal olduğunu bildiren bir mesaj gönderebilirsiniz.
            await hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", "İşlem iptal edildi.");
        }
        catch (Exception ex)
        {
            // Diğer hataların yakalanması ve loglanması.
            // Hata mesajını istemciye gönderebilir veya başka işlemler yapabilirsiniz.
            await hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", $"Bir hata oluştu: {ex.Message}");
            // Loglama örneği: _logger.LogError(ex, "GetMessageStreamAsync sırasında hata oluştu.");
        }
    }


    public static IList<ChatMessage> ConvertChatHistoryToChatMessages(ChatHistory history)
    {
        var chatMessages = new List<ChatMessage>();

        foreach (var messageContent in history)
        {
            // AuthorRole değerini ChatRole'a dönüştürüyoruz.
            //ChatRole chatRole = messageContent.Role switch
            //{
            //    AuthorRole.User => ChatRole.User,
            //    AuthorRole.Assistant => ChatRole.Assistant,
            //    AuthorRole.System => ChatRole.System,
            //    AuthorRole.Developer => ChatRole.Developer,
            //    _ => ChatRole.User
            //};

            // Varsayıyoruz ki ChatMessageContent'in "Content" isminde mesaj metnini veren bir özelliği var.
            string content = messageContent.Content;

            // ChatMessage nesnesini oluşturuyoruz.
            var chatMessage = new ChatMessage(ChatRole.User, content);

            // Ek bilgiler gerekiyorsa, örneğin AuthorName, ekleyebilirsiniz.
            // chatMessage.AuthorName = messageContent.AuthorName;

            chatMessages.Add(chatMessage);
        }

        return chatMessages;
    }
}