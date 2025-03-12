import React, { useEffect, useState } from "react";
import "./topbar_with_menu.css";
import {
  AiFillSound,
  AiFillPauseCircle,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineMuted,
  AiOutlinePause,
  AiOutlinePlayCircle,
  AiOutlineUndo,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineRight,
} from "react-icons/ai";
import { useArticleContext } from "../context/article_context";

const TopbarWithMenu = () => {
  const [fontSize, setFontSize] = useState(100);
  const [playing, setPlaying] = useState("none");
  const [utterance, setUtterance] = useState(new SpeechSynthesisUtterance());
  const [originalFontSizes, _] = useState(new Map());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
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
  }, []);

  // Previous theme and font-related useEffects and functions remain the same
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
  //

  // Previous speech and font-related functions remain the same
  function resetSpeech() {
    setPlaying("none");
    speechSynthesis.cancel();
  }

  function speak() {
    setPlaying("on");
    speechSynthesis.resume();
    utterance.text = article;
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0];
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
    setOpenSubMenu(null);
  };

  function increaseFontSizeByPercentage(percentage) {
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      if (!element.classList.contains("accessibility")) {
        const currentFontSize = window.getComputedStyle(element).fontSize;
        const currentSizeInPixels = parseFloat(currentFontSize) / 17;
        const newFontSize =
          currentSizeInPixels * (1 + (percentage - 100) / 100);
        element.style.fontSize = `${newFontSize}rem`;
      }
    });
  }

  function decreaseFontSizeByPercentage(percentage) {
    if (percentage <= 110) {
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenSubMenu(null);
  };

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  return (
    <div className="accessibility-wrapper">
      <div className="hamburger-menu" onClick={toggleMenu}>
        {isMenuOpen ? (
          <AiOutlineClose size={24} color={`${isdark ? "white" : "white"}`} />
        ) : (
          <AiOutlineMenu size={24} color={`${isdark ? "white" : "black"}`} />
        )}
      </div>

      {isMenuOpen && (
        <div className={`accessibility-dropdown ${isdark ? "" : "shadown-md"}`}>
          {/* Text to Speech Options */}
          <div className="dropdown-section">
            <div className="dropdown-section-title">Text to Speech</div>
            <div className="dropdown-section-content">
              {playing === "none" ? (
                <div className="dropdown-item" onClick={speak}>
                  <AiOutlineMuted color="white" />
                  <span>Start Reading</span>
                </div>
              ) : (
                <>
                  {playing === "on" && (
                    <div className="dropdown-item" onClick={pauseSpeech}>
                      <AiOutlinePause color="white" />
                      <span>Pause</span>
                    </div>
                  )}
                  {playing === "pause" && (
                    <div className="dropdown-item" onClick={playSpeech}>
                      <AiOutlinePlayCircle color="white" />
                      <span>Resume</span>
                    </div>
                  )}
                  <div className="dropdown-item" onClick={resetSpeech}>
                    <AiOutlineUndo color="white" />
                    <span>Stop</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Theme Options */}
          <div className="dropdown-section">
            <div className="dropdown-section-title">Theme</div>
            <div className="dropdown-section-content">
              <div
                className={`dropdown-item ${!isdark ? "active" : ""}`}
                onClick={() => toggleIsDark(false)}
              >
                <span className="theme-circle light-theme"></span>
                <span>Light Theme</span>
              </div>
              <div
                className={`dropdown-item ${isdark ? "active" : ""}`}
                onClick={() => toggleIsDark(true)}
              >
                <span className="theme-circle dark-theme"></span>
                <span>Dark Theme</span>
              </div>
            </div>
          </div>

          {/* Font Family */}
          <div className="dropdown-section">
            <div
              className="dropdown-section-title"
              onClick={() => toggleSubMenu("fontFamily")}
            >
              Font Family
              <AiOutlineRight
                className={`dropdown-arrow ${
                  openSubMenu === "fontFamily" ? "rotate-90" : ""
                }`}
              />
            </div>
            {openSubMenu === "fontFamily" && (
              <div className="dropdown-section-content sub-menu">
                <div
                  className="dropdown-item"
                  onClick={() => changeFontFamily(0)}
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', Times, serif",
                  }}
                >
                  Georgia
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => changeFontFamily(1)}
                  style={{
                    fontFamily:
                      "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
                  }}
                >
                  Arial
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => changeFontFamily(2)}
                  style={{
                    fontFamily:
                      "'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif",
                  }}
                >
                  OpenDyslexic
                </div>
              </div>
            )}
          </div>

          {/* Font Size */}
          <div className="dropdown-section">
            <div
              className="dropdown-section-title"
              onClick={() => toggleSubMenu("fontSize")}
            >
              Font Size
              <AiOutlineRight
                className={`dropdown-arrow ${
                  openSubMenu === "fontSize" ? "rotate-90" : ""
                }`}
              />
            </div>
            {openSubMenu === "fontSize" && (
              <div className="dropdown-section-content font-size-control sub-menu">
                <div className="dropdown-item">
                  <div className="font-size-controls">
                    <span
                      className="font-size-button"
                      onClick={() => {
                        if (fontSize < 200) {
                          setFontSize((prev) => prev + 10);
                          increaseFontSizeByPercentage(fontSize + 10);
                        }
                      }}
                    >
                      <AiOutlinePlus color="white" />
                    </span>
                    <span className="font-size-value">{fontSize}%</span>
                    <span
                      className="font-size-button"
                      onClick={() => {
                        if (fontSize > 100) {
                          setFontSize((prev) => prev - 10);
                          decreaseFontSizeByPercentage(fontSize);
                        }
                      }}
                    >
                      <AiOutlineMinus color="white" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopbarWithMenu;
