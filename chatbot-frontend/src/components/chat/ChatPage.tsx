import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backend_root, auth } from "../../firebase-config";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatPage.css";

interface Message {
  id: string;
  text: string;
  sender: "AI" | "Human";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [response, setResponse] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() !== "") {
      generateOutput();
      return;
    }
    if (e.key === "Enter" && e.shiftKey) {
      setQuery((previous) => previous + "\n");
      return;
    }
  };
  const queryLLM = async () => {
    try {
      let userID = auth.currentUser?.uid;
      let response = await axios.post(`${backend_root}/generate`, {
        userID: userID,
        user_prompt: query,
      });
      return response.data.bot_response;
    } catch (error) {
      return error;
    }
  };
  const generateOutput = async () => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      text: query,
      sender: "Human",
    };
    setResponse("processing");
    setMessages((prev) => [...prev, newMessage]);
    let bot_reply = await queryLLM();
    const newBotMessage: Message = {
      id: crypto.randomUUID(),
      text: bot_reply,
      sender: "AI",
    };
    setMessages((prev) => [...prev, newBotMessage]);
    setResponse("");
    setQuery("");
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="chat-page">
      <button className="back-button" onClick={() => navigate("/home")}>
        Back
      </button>
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender}-message`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          ))}
          {response === "processing" && (
            <div className="loading-message bot-message">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          )}
        </div>
        <input
          type="text"
          className="user-input"
          placeholder="Ask me anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}
