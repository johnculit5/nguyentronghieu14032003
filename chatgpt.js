const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn")

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatli = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined"><i class="fa-solid fa-user-graduate"></i></span><p></p>`;
    chatLi.innerHTML = chatContent;

    // Tránh bị lỗi h1 h1
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}


const displayResponse = (response, incomingchatLi) => {
    const messageElement = incomingchatLi.querySelector("p");

    // Kiểm tra xem phản hồi có thuộc tính "choices" và "message" không
    if (response.choices && response.choices.length > 0 && response.choices[0].message) {
        messageElement.textContent = response.choices[0].message.content;
    } else {
        console.log("Invalid response format");
    }
}



const generateResponse = (incomingchatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";

    const messageElement = incomingchatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            // max_tokens: 50,
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    }

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data); // Thêm dòng này để xem phản hồi từ API
            displayResponse(data, incomingchatLi);
        })
        .catch((error) => {
            messageElement.classList.add("error");
            messageElement.textContent="Oops! Something went wrong. Please try again.";
        }).finally(() =>  chatbox.scrollTo(0, chatbox.scrollHeight));
}


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Lỗi blank 1 lần  khi chat
    chatInput.value ="";
    chatInput.style.height = `${inputInitHeight}px`;

    // thêm vào câu lệnh
    chatbox.appendChild(createChatli(userMessage, "outgoing"));

    // scroll 
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Chương trình đang chạy
    setTimeout(() => {
        // Chương trình loading bằng câu "Thinking ... " khi đang đợi câu trả lời
        const incomingchatLi = createChatli("Thinking...", "incoming")
        chatbox.appendChild(incomingchatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingchatLi);
        // Dùng GPT
    }, 600)
}


chatInput.addEventListener("input", () => {
    // Chiều cao ccho khung chat
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}}px`;
})

chatInput.addEventListener("keydown", (e) => {
    // Phím enter / shift enter
   if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
   }
})




sendChatBtn.addEventListener("click", handleChat);

// Ân hiện chat box
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

