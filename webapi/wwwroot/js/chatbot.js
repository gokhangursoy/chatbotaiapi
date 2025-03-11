(function () {
    // CSS içeriğini stil etiketine ekleyelim.
    var css = `
/* Import Google font - Poppins */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.chatbot-toggler {
  position: fixed;
  bottom: 30px;
  right: 35px;
  outline: none;
  border: none;
  height: 50px;
  width: 50px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #003B64;
  transition: all 0.2s ease;
  z-index: 9999;
}
body.show-chatbot .chatbot-toggler {
  transform: rotate(90deg);
}
.chatbot-toggler span {
  color: #fff;
  position: absolute;
}
.chatbot-toggler span:last-child,
body.show-chatbot .chatbot-toggler span:first-child  {
  opacity: 0;
}
body.show-chatbot .chatbot-toggler span:last-child {
  opacity: 1;
}
.chatbot {
  position: fixed;
  right: 35px;
  bottom: 90px;
  width: 420px;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.5);
  transform-origin: bottom right;
  box-shadow: 0 0 128px 0 rgba(0,0,0,0.1),
              0 32px 64px -48px rgba(0,0,0,0.5);
  transition: all 0.1s ease;
  z-index: 9999;
}
body.show-chatbot .chatbot {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
}
.chatbot header {
  padding: 12px 0;
  position: relative;
  text-align: center;
  color: #fff;
  background: #003B64;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.chatbot header span {
  position: absolute;
  right: 15px;
  top: 20%;
  display: none;
  cursor: pointer;
  transform: translateY(-50%);
}
.chatbot header p {
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: start;
  padding-left: 5px;
  margin-bottom: 0px;
}
.chatbot header h2 {
  color: #fff;
  font-size: 1.4rem;
}
.chatbot .chatbox {
  overflow-y: auto;
  height: 510px;
  padding: 30px 20px 100px;
}
.chatbot :where(.chatbox, textarea)::-webkit-scrollbar {
  width: 6px;
}
.chatbot :where(.chatbox, textarea)::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 25px;
}
.chatbot :where(.chatbox, textarea)::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 25px;
}
.chatbox .chat {
  display: flex;
  list-style: none;
}
.chatbox .outgoing {
  margin: 20px 0;
  justify-content: flex-end;
}
.chatbox .incoming span {
  width: 32px;
  height: 32px;
  color: #fff;
  cursor: default;
  text-align: center;
  line-height: 32px;
  align-self: flex-end;
  background: #003B64;
  border-radius: 4px;
  margin: 0 10px 7px 0;
}
.chatbox .chat p {
  white-space: pre-wrap;
  padding: 12px 16px;
  border-radius: 10px 10px 0 10px;
  max-width: 75%;
  color: #fff;
  font-size: 0.95rem;
  background: #003B64;
}
.chatbox .incoming p {
  border-radius: 10px 10px 10px 0;
}
.chatbox .chat p.error {
  color: #721c24;
  background: #f8d7da;
}
.chatbox .incoming p {
  color: #000;
  background: #f2f2f2;
}
.chatbot .chat-input {
  display: flex;
  gap: 5px;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #fff;
  padding: 3px 20px;
  border-top: 1px solid #ddd;
}
.chat-input textarea {
  height: 55px;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  max-height: 180px;
  padding: 15px 15px 15px 0;
  font-size: 0.95rem;
}
.chat-input span {
  align-self: flex-end;
  color: #003B64;
  cursor: pointer;
  height: 55px;
  display: flex;
  align-items: center;
  visibility: hidden;
  font-size: 1.35rem;
}
.chat-input textarea:valid ~ span {
  visibility: visible;
}
@media (max-width: 490px) {
  .chatbot-toggler {
    right: 20px;
    bottom: 20px;
    z-index: 9999;
  }
  .chatbot {
    right: 0;
    bottom: 0;
    height: 100%;
    border-radius: 0;
    width: 100%;
    z-index: 9999;
  }
  .chatbot .chatbox {
    height: 90%;
    padding: 25px 15px 100px;
  }
  .chatbot .chat-input {
    padding: 5px 15px;
  }
  .chatbot header span {
    display: block;
  }
}
  `;
    var styleEl = document.createElement("style");
    styleEl.type = "text/css";
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);

    // Gerekli Google font linklerini ekleyelim.
    var fonts = [
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap",
        "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0",
        "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0"
    ];
    fonts.forEach(function (href) {
        var linkEl = document.createElement("link");
        linkEl.rel = "stylesheet";
        linkEl.href = href;
        document.head.appendChild(linkEl);
    });

    // SignalR kütüphanesini yükleyelim.
    function loadSignalR(callback) {
        var script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.1/signalr.js";
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Chatbot HTML yapısını oluşturan fonksiyon
    function injectChatbotHTML() {
        var container = document.createElement("div");
        container.innerHTML = `
      <button class="chatbot-toggler">
        <span class="material-symbols-rounded">mode_comment</span>
        <span class="material-symbols-outlined">close</span>
      </button>
      <div class="chatbot">
        <header>
          <h2>AI Asistan</h2>
          <p>Bu uygulama, yapay zeka (AI) teknolojisiyle desteklenmektedir. Sağlanan yorumların doğruluğu kesin olarak garanti edilmemekte olup, hukuki bağlayıcılık taşımamaktadır.</p>
          <span class="close-btn material-symbols-outlined">close</span>
        </header>
        <ul class="chatbox">
          <li class="chat incoming">
            <span class="material-symbols-outlined">smart_toy</span>
            <p>Merhaba! <br />Size nasıl yardımcı olabilirim?</p>
          </li>
        </ul>
        <div class="chat-input">
          <textarea placeholder="Mesajınızı giriniz..." spellcheck="false" required></textarea>
          <span id="send-btn" class="material-symbols-rounded">send</span>
        </div>
      </div>
    `;
        document.body.insertAdjacentElement("beforeend", container);
    }

    // Chatbot işleyişini başlatan mantığı tanımlıyoruz.
    function initChatbotLogic() {
        var chatbotToggler = document.querySelector(".chatbot-toggler");
        var closeBtn = document.querySelector(".close-btn");
        var chatbox = document.querySelector(".chatbox");
        var chatInput = document.querySelector(".chat-input textarea");
        var sendChatBtn = document.querySelector(".chat-input span");
        var userMessage = null;
        var inputInitHeight = chatInput.scrollHeight;

        // SignalR HUB bağlantısını oluşturuyoruz.
        var hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7059/ai-hub")
            .build();

        hubConnection.start().catch(function (err) {
            console.error(err.toString());
        });

        hubConnection.on("ReceiveMessage", function (responseMessage) {
            chatbox.innerHTML += responseMessage;
            chatbox.scrollTop = chatbox.scrollHeight;
        });

        var API_URL = "https://localhost:7059/api/Chat";

        function createChatLi(message, className) {
            var chatLi = document.createElement("li");
            chatLi.classList.add("chat", className);
            var chatContent = className === "outgoing"
                ? `<p></p>`
                : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
            chatLi.innerHTML = chatContent;
            chatLi.querySelector("p").textContent = message;
            return chatLi;
        }

        async function generateResponse(chatElement) {
            var messageElement = chatElement.querySelector("p");
            var requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: userMessage,
                    connectionId: hubConnection.connectionId,
                }),
            };

            try {
                var response = await fetch(API_URL, requestOptions);
                var text = await response.text();
                if (!text) throw new Error("API'den boş yanıt alındı.");
                var data = JSON.parse(text);

                if (!response.ok) {
                    throw new Error(data.error && data.error.message ? data.error.message : "API hatası oluştu.");
                }

                messageElement.textContent = data.candidates[0].content.parts[0].text.replace(
                    /\*\*(.*?)\*\*/g,
                    "$1"
                );
            } catch (error) {
                messageElement.classList.add("error");
                messageElement.textContent = error.message;
            } finally {
                chatbox.scrollTo(0, chatbox.scrollHeight);
            }
        }

        function handleChat() {
            userMessage = chatInput.value.trim();
            if (!userMessage) return;

            chatInput.value = "";
            chatInput.style.height = inputInitHeight + "px";
            chatbox.appendChild(createChatLi(userMessage, "outgoing"));
            chatbox.scrollTo(0, chatbox.scrollHeight);

            setTimeout(function () {
                var incomingChatLi = createChatLi("Düşünüyor...", "incoming");
                chatbox.appendChild(incomingChatLi);
                chatbox.scrollTo(0, chatbox.scrollHeight);
                generateResponse(incomingChatLi);
            }, 600);
        }

        chatInput.addEventListener("input", function () {
            chatInput.style.height = inputInitHeight + "px";
            chatInput.style.height = chatInput.scrollHeight + "px";
        });

        chatInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                e.preventDefault();
                handleChat();
            }
        });

        sendChatBtn.addEventListener("click", handleChat);
        closeBtn.addEventListener("click", function () {
            document.body.classList.remove("show-chatbot");
        });
        chatbotToggler.addEventListener("click", function () {
            document.body.classList.toggle("show-chatbot");
        });
    }

    // Başlangıç: HTML'yi ekle, SignalR yüklenmesini sağla ve chatbot mantığını başlat.
    function init() {
        injectChatbotHTML();
        // Eğer sayfa henüz yüklenmediyse DOMContentLoaded eventini bekleyelim.
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initChatbotLogic);
        } else {
            initChatbotLogic();
        }
    }

    loadSignalR(init);
})();
