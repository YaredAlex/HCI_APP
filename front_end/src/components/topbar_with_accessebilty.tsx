import React, { useEffect, useState } from "react";
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
import "./tobar_with_accessebility.css";
import { useArticleContext } from "../context/article_context";
const TopbarWithAccessebility = () => {
  const [fontSize, setFontSize] = useState(100);
  const [playing, setPlaying] = useState("none");
  const [utterance, setUtterance] = useState(new SpeechSynthesisUtterance());
  const [originalFontSizes, _] = useState(new Map());
  const { isdark, toggleIsDark, article } = useArticleContext();
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

  //  Changing theme
  useEffect(() => {
    if (isdark) {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [isdark]);

  const fontFamily = [
    "'Georgia', 'Times New Roman', Times, serif",
    "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
    "'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif",
  ];

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
            <span className="cursor-pointer accessibility" onClick={playSpeech}>
              <AiOutlinePlayCircle color="white" />
            </span>
          ) : (
            ""
          )}
          <span onClick={resetSpeech} className="cursor-pointer accessibility">
            <AiOutlineUndo color="white" className="accessibility" />
          </span>
        </div>
        <div className="theme-option d-flex gap-2 accessibility">
          <span
            className={`rounded-circle bg-white cursor-pointer accessibility ${
              isdark ? "" : "active"
            } `}
            onClick={() => toggleIsDark(false)}
          ></span>
          <span
            className={`rounded-circle bg-dark cursor-pointer accessibility ${
              isdark ? "active" : ""
            }`}
            onClick={() => toggleIsDark(true)}
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
  );
};

export default TopbarWithAccessebility;
