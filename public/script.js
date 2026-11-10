const chat = document.getElementById("chat");

function add(text, cls){
  const div = document.createElement("div");
  div.className = "msg " + cls;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function send(){
  const input = document.getElementById("input");
  const message = input.value.trim();
  if(!message) return;

  add(message,"user");
  input.value="";

  const res = await fetch("/chat",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  add(data.reply,"bot");
  speak(data.reply);
}

function voice(){
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.start();
  recognition.onresult = e => {
    document.getElementById("input").value = e.results[0][0].transcript;
  };
}

function speak(text){
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang="en-US";
  window.speechSynthesis.speak(speech);
}