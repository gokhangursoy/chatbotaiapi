using Microsoft.Extensions.AI;
using webapi.Hubs;
using webapi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddKernel();
builder.Services.AddChatClient(new OllamaChatClient(new Uri("http://localhost:11434"), "llama3:latest"));
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyMethod()
                                           .AllowAnyHeader()
                                           .AllowCredentials()
                                           .SetIsOriginAllowed(s => true)));
builder.Services.AddSignalR();
builder.Services.AddScoped<AIService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
}

app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = context =>
    {
        if (context.File.PhysicalPath.EndsWith(".js", StringComparison.OrdinalIgnoreCase))
        {
            context.Context.Response.Headers["Content-Type"] = "application/javascript; charset=utf-8";
        }
    }
});

app.UseCors();
app.UseAuthorization();


app.MapControllers();
app.MapHub<AIHub>("ai-hub");
app.Run();