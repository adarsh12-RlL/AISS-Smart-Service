const express = require("express");
const cors = require("cors");
const fs = require("fs");
const detect = require("detect-port").default || require("detect-port");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ======================
   LOAD MEMORY SAFELY
====================== */
let memory = [];

try {
  if (fs.existsSync("memory.json")) {
    const data = fs.readFileSync("memory.json", "utf-8");
    memory = data ? JSON.parse(data) : [];
  }
} catch (err) {
  console.log("Memory file corrupted. Resetting...");
  memory = [];
  fs.writeFileSync("memory.json", "[]");
}

/* ======================
   SMART RULE ENGINE
====================== */
function generateReply(message) {
  const msg = message.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi"))
    return "Hello! I am AISS. How can I help you today?";

  if (msg.includes("your name"))
    return "My name is AISS (Artificial Intelligence Smart System).";

  if (msg.includes("time"))
    return "Current time: " + new Date().toLocaleTimeString();

  if (msg.includes("date"))
    return "Today's date: " + new Date().toLocaleDateString();

  if (msg.includes("javascript"))
    return "JavaScript Example:\n\nfunction greet(){\n  console.log('Hello from AISS');\n}";

  if (msg.includes("python"))
    return "Python Example:\n\ndef greet():\n    print('Hello from AISS')";

  if (msg.includes("html"))
    return "<!DOCTYPE html>\n<html>\n<body>Hello AISS</body>\n</html>";

  if (msg.includes("css"))
    return "CSS Example:\n\nbody {\n  background: black;\n  color: white;\n}";

  return "I am AISS offline assistant. Try asking about time, date, javascript, python, html, or css.";
}

/* ======================
   CHAT ROUTE
====================== */
app.post("/chat", (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({ reply: "Message is required." });
  }

  const reply = generateReply(message);

  memory.push({ user: message, bot: reply });
  fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));

  res.json({ reply });
});

/* ======================
   AUTO PORT START
====================== */
(async () => {
  try {
    const port = await detect(3000); // Start checking from 3000
    app.listen(port, () => {
      console.log(`🚀 AISS running at http://localhost:${port}`);
    });
  } catch (err) {
    console.log("Error finding port:", err);
  }
})();