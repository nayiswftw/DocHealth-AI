import { useState } from "react";
import "./Chat.css";
import axios from "axios";
import Markdown from "react-markdown";

function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateAnswer = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("Loading...");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBxVk0hfKGLQe9s2JK4GPMWuRvcaT40DN8",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });
      setAnswer(response.data.candidates[0].content.parts[0].text);
      setQuestion("");

    } catch (err) {
      setError("Error fetching response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="chat">
      <div id="chat-messages">
        {error && <p className="error">{error}</p>}
        <Markdown>{answer || "Ask me anything!"}</Markdown>
      </div>
      <div id="chat-input">
        <input
          type="text"
          placeholder="Message DocHealth AI"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button onClick={generateAnswer}></button>
      </div>
    </div>
  );
}

export default Chat;
