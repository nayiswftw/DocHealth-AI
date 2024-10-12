import { useState } from "react";
import "./Chat.css";
import axios from "axios";
import Markdown from "react-markdown";

function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function generateAnswer() {
    setAnswer("loading..");
    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBxVk0hfKGLQe9s2JK4GPMWuRvcaT40DN8",
      method: "post",
      data: {
        contents: [{ parts: [{ text: question }] }],
      },
    });
    setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]);
    console.log(response);
  }

  return (
    <>
      <div id="chat">
        
        <div id="chat-messages">
            <Markdown>{answer || "Ask me anything!"}</Markdown>
        </div>

        
        <div id="chat-input">
          <button 
            onClick={generateAnswer}
            ></button>
          
          <input
            placeholder="Message DocHealth AI"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></input>
        </div>
        
      </div>
    </>
  );
}

export default Chat;
