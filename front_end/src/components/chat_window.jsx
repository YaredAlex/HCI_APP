import { useState } from "react";
import { BsSend, BsFillPlayFill } from "react-icons/bs";
import "./chat_window.css";
import axios from "axios";
import { useArticleContext } from "../context/article_context";
import Markdown from "react-markdown";
const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const { article } = useArticleContext();
  const [loading, setLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [activeAudio, setActiveAudio] = useState(null);
  const [synth, _] = useState(window.speechSynthesis);
  const sendRequest = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    const aiResponse = {
      id: Date.now() + 1,
      role: "ai",
      text: "",
      timestamp: new Date().toLocaleTimeString(),
    };
    setHistory([...history, userMessage]);
    setMessage("");
    //making request
    axios
      .post("/api/chat-ai", {
        content: article,
        message,
      })
      .then((res) => {
        aiResponse.text = res.data["summary"];
      })
      .catch((e) => {
        alert(JSON.stringify(e));
        console.log(e);
        aiResponse.text = "Error occured!";
      })
      .finally(() => {
        setLoading(false);
        setHistory((prev) => [...prev, aiResponse]);
      });
  };

  const playAudio = (text, chat_id) => {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = function () {
      synth.cancel();
      setActiveAudio(null);
    };
    synth.speak(utterance);
    setPlayingAudio(true);
    setActiveAudio(chat_id);
  };
  const pauthAudio = () => {
    synth.pause();
    setPlayingAudio(false);
  };
  const resumeAudio = () => {
    synth.resume();
    setPlayingAudio(true);
  };

  return (
    <div className="chat-window">
      {/* Chat Messages */}
      <div className="chat-history">
        {history.map((chat) => (
          <div key={chat.id} className={`chat-bubble ${chat.role}`}>
            {chat.role === "user" ? (
              <p>{chat.text}</p>
            ) : (
              <Markdown>{chat.text}</Markdown>
            )}
            <span className="timestamp">{chat.timestamp}</span>
            {chat.role === "ai" &&
              (activeAudio !== chat.id ? (
                <button
                  className="play-audio"
                  onClick={() => playAudio(chat.text, chat.id)}
                >
                  <BsFillPlayFill />
                </button>
              ) : (
                <button
                  className="play-audio"
                  onClick={() => (!playingAudio ? resumeAudio() : pauthAudio())}
                >
                  <BsFillPlayFill />
                </button>
              ))}
          </div>
        ))}
        {loading ? (
          <div className="d-flex gap-2 loading-container">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Input Box */}
      <div className="chat-input-container">
        <textarea
          name="chat"
          id="chat"
          placeholder="Chat with Gemini"
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" onClick={sendRequest}>
          Send <BsSend />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
