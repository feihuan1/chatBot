
const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const inputInitHeight = chatInput.scrollHeight
const API_KEY = key;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined"> smart_toy </span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector('p').textContent= message;
  return chatLi;
};



const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector('p')

  const requestOptions = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  fetch(API_URL, requestOptions)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    messageElement.textContent = data.choices[0].message.content;
  })
  .catch((error) => {

    console.log(error)
    messageElement.classList.add('error')
    messageElement.textContent = 'You ask me Toooo many questions in a day, API will make the poor dev broke...'
  }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight))
};



function handleChat() {
  userMessage = chatInput.value.trim();

  if (!userMessage) return;
  chatInput.style.height = `${inputInitHeight}px`


  chatbox.append(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight)

  setTimeout(() => {
    const incomingChatLi =createChatLi("Thinking...", "incoming")
    chatbox.append(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight)
    generateResponse(incomingChatLi);
  }, 600);

  chatInput.value = "";
}

chatInput.addEventListener('input', () => {
   chatInput.style.height = `${inputInitHeight}px`
   chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    handleChat();
  }
})




sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener('click', () => document.body.classList.toggle('show-chatbot'))
chatbotCloseBtn.addEventListener('click', () => document.body.classList.remove('show-chatbot'))
