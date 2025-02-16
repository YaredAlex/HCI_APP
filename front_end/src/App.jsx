import { useEffect, useState } from "react";
import {
  AiFillSound,
  AiFillPauseCircle,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineMuted,
  AiOutlinePause,
  AiOutlinePlayCircle,
  AiOutlineUndo,
} from "react-icons/ai";
import { KokoroTTS } from "kokoro-js";
import ReactLoading from "react-loading";
import "./App.css";
import axios from "axios";
import Accessibility from "./access";
function App() {
  const [contentUrl, setContentUrl] = useState("");
  const [article, setArticle] = useState("No data found");
  const [isdark, setIsdark] = useState(true);
  const [fontSize, setFontSize] = useState(100);
  const [playing, setPlaying] = useState("none");
  const [utterance, setUtterance] = useState(new SpeechSynthesisUtterance());
  const [originalFontSizes, _] = useState(new Map());
  const [isLoading, setLoading] = useState(false);
  const [audioFile, setAudio] = useState(null);
  const fontFamily = [
    "'Georgia', 'Times New Roman', Times, serif",
    "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
    "'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif",
  ];
  useEffect(() => {
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const currentFontSize = computedStyle.fontSize;
      // Store original font size if not already stored
      if (!originalFontSizes.has(element)) {
        originalFontSizes.set(element, currentFontSize);
      }
    });
  });
  useEffect(() => {
    const tts = async () => {
      const model_id = "onnx-community/Kokoro-82M-ONNX";
      const tts = await KokoroTTS.from_pretrained(model_id, {
        dtype: "q8", // Options: "fp32", "fp16", "q8", "q4", "q4f16"
        device: "webgpu",
      });

      const text =
        "Life is like a box of chocolates. You never know what you're gonna get.";
      const audio = await tts.generate(text, {
        // Use `tts.list_voices()` to list all available voices
        voice: "af_bella",
      });

      // audio.save("audio.wav");
      console.log(audio, "audio file");
      // setAudio(audio);
      const audioBlob = new Blob([audio.toBlob()], { type: "audio/wav" });

      // Create a URL for the Blob
      const audioUrl = URL.createObjectURL(audioBlob);

      // Embed the URL in the <audio> tag
      const audioPlayer = document.getElementById("audio-player");
      audioPlayer.src = audioUrl;
      audioPlayer.load();
    };
    // tts();
  }, []);
  useEffect(() => {
    if (isdark) {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
    console.log("called");
  }, [isdark]);
  function resetSpeech() {
    setPlaying("none");
    speechSynthesis.cancel();
    // setUtterance(new SpeechSynthesisUtterance());
  }
  function speak() {
    // Select a voice
    setPlaying("on");
    speechSynthesis.resume();
    utterance.text = article;
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0]; // Choose a specific voice
    // Speak the text
    speechSynthesis.speak(utterance);
  }

  function pauseSpeech() {
    setPlaying("pause");
    speechSynthesis.pause();
  }
  function playSpeech() {
    setPlaying("on");
    speechSynthesis.resume();
  }
  const getResource = async () => {
    if (contentUrl == "") console.log(contentUrl);
    setLoading(true);
    axios
      .post("http://127.0.0.1:5000/api/search", { url: contentUrl })
      .then((res) => {
        if (res.data) {
          const articleContainer = document.getElementById("article-container");
          articleContainer.innerHTML = res.data.article;
          const imgTags = articleContainer.querySelectorAll("img");
          //wrapping img with image wrapper
          imgTags.forEach((child) => {
            const parent = child.parentNode;
            const divWrapper = document.createElement("div");
            divWrapper.classList.add("img-wrapper");
            parent.style.width = "auto";
            if (parent.nodeName !== "A")
              divWrapper.appendChild(child.cloneNode());

            parent.replaceChild(divWrapper, child);
            console.log("wrapped");
          });
          setArticle(res.data.text);
        }
      })
      .catch((e) => alert(JSON.stringify(e)))
      .finally(() => {
        setLoading(false);
      });
  };
  const changeFontFamily = (index) => {
    document.body.style.fontFamily = fontFamily[index];
    console.log(document.body.style.fontFamily);
  };
  function increaseFontSizeByPercentage(percentage) {
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      if (!element.classList.contains("accessibility")) {
        const currentFontSize = window.getComputedStyle(element).fontSize;
        const currentSizeInPixels = parseFloat(currentFontSize) / 17;
        const newFontSize =
          currentSizeInPixels * (1 + (percentage - 100) / 100);
        console.log(newFontSize, currentFontSize);
        element.style.fontSize = `${newFontSize}rem`;
      }
    });
  }
  function decreaseFontSizeByPercentage(percentage) {
    if (percentage == 110) {
      resetFontSizes();
      return;
    }

    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      if (!element.classList.contains("accessibility")) {
        const currentFontSize = window.getComputedStyle(element).fontSize;
        const currentSizeInPixels = parseFloat(currentFontSize) / 17;
        const newFontSize =
          currentSizeInPixels / (1 + (percentage - 100) / 100);
        element.style.fontSize = `${newFontSize}rem`;
      }
    });
  }
  function resetFontSizes() {
    originalFontSizes.forEach((fontSize, element) => {
      element.style.fontSize = fontSize;
    });
    originalFontSizes.clear();
  }
  return (
    <main className="">
      <Accessibility />
      <div className="accessibility-wrapper">
        <div className="accessibility-options">
          <div className="tts-option d-flex gap-2 accessibility">
            {/* <audio id="audio-player" controls></audio> */}
            {playing === "none" ? (
              <span
                className="tts-button cursor-pointer accessibility"
                onClick={speak}
              >
                <AiOutlineMuted color="white" className="accessibility" />
              </span>
            ) : (
              ""
            )}
            {playing === "on" ? (
              <span
                className="cursor-pointer accessibility"
                onClick={pauseSpeech}
              >
                <AiOutlinePause color="white" />
              </span>
            ) : (
              ""
            )}
            {playing === "pause" ? (
              <span
                className="cursor-pointer accessibility"
                onClick={playSpeech}
              >
                <AiOutlinePlayCircle color="white" />
              </span>
            ) : (
              ""
            )}
            <span
              onClick={resetSpeech}
              className="cursor-pointer accessibility"
            >
              <AiOutlineUndo color="white" className="accessibility" />
            </span>
          </div>
          <div className="theme-option d-flex gap-2 accessibility">
            <span
              className={`rounded-circle bg-white cursor-pointer accessibility ${
                isdark ? "" : "active"
              } `}
              onClick={() => setIsdark(false)}
            ></span>
            <span
              className={`rounded-circle bg-dark cursor-pointer accessibility ${
                isdark ? "active" : ""
              }`}
              onClick={() => setIsdark(true)}
            ></span>
          </div>

          <div className="font-option accessibility">
            <span
              className="cursor-pointer accessibility"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', Times, serif",
              }}
              onClick={() => changeFontFamily(0)}
            >
              Aa
            </span>
            <span
              className="cursor-pointer accessibility"
              style={{
                fontFamily: "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
              }}
              onClick={() => changeFontFamily(1)}
            >
              Aa
            </span>
            <span
              className="cursor-pointer accessibility"
              style={{
                fontFamily:
                  "'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif",
              }}
              onClick={() => changeFontFamily(2)}
            >
              Aa
            </span>
          </div>

          <div className="accessibility font-size-option d-flex gap-2 align-items-center justify-content-center">
            <span
              className="cursor-pointer accessibility"
              onClick={() => {
                if (fontSize < 200) {
                  setFontSize((prev) => prev + 10);
                  increaseFontSizeByPercentage(fontSize + 10);
                }
              }}
            >
              <AiOutlinePlus
                className="accessibility"
                color={`${isdark ? "white" : "white"}`}
              />
            </span>
            <span className="accessibility">{fontSize}%</span>
            <span
              className="cursor-pointer accessibility"
              onClick={() => {
                if (fontSize > 100) {
                  setFontSize((prev) => prev - 10);
                  console.log(fontSize);
                  decreaseFontSizeByPercentage(fontSize);
                }
              }}
            >
              <AiOutlineMinus color="white" className="accessibility" />
            </span>
          </div>
        </div>
      </div>
      <div className="article-container">
        <div className="d-flex col flex-column align-items-center justify-content-center m-auto gap-2">
          <label htmlFor="search">Search URL</label>
          <form
            className="d-flex w-100 align-items-center justify-content-center  gap-2 col"
            onSubmit={(e) => {
              e.preventDefault();
              getResource();
            }}
          >
            <input
              className="col"
              type="text"
              placeholder="search url"
              id="search"
              onChange={(e) => setContentUrl(e.target.value)}
              required
            />
            <input
              className="custom-button bg-primary rounded text-white"
              type="submit"
              value={"Search"}
            />
          </form>
        </div>
        {isLoading && (
          <div className="d-flex align-items-center justify-content-center py-2 flex-column">
            <ReactLoading
              type={"spin"}
              color={`${isdark ? "white" : "black"}`}
              height={50}
              width={50}
            />
            Loading please wait...
          </div>
        )}
        <article id="article-container">
          <p className="text-center">Search your GFG Article</p>
        </article>
      </div>
    </main>
  );
}

export default App;
