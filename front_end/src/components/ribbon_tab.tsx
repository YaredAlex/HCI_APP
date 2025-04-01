import React, { useEffect, useState } from "react";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlinePlayCircle,
  AiOutlinePauseCircle,
  AiOutlineStop,
  AiOutlineInfoCircle,
  AiOutlineDown,
  AiOutlineRight,
  AiOutlineUp,
} from "react-icons/ai";
import { BsSun, BsMoon } from "react-icons/bs";
import "./ribbon_tab.css";
import { useArticleContext } from "../context/article_context";
import TopbarWithMenu from "./topbar_with_menu";
const Ribbon = () => {
  const [fontSize, setFontSize] = useState(100); // Font size percentage
  const [playing, setPlaying] = useState("none"); // Text-to-speech state
  const [utterance] = useState(new SpeechSynthesisUtterance());
  const [originalFontSizes] = useState(new Map());
  const [activeTab, setActiveTab] = useState("Home"); // Theme state (simplified, assuming no context)
  const { showAccessibility, toggleAccessibility, isdark, toggleIsDark } =
    useArticleContext();
  // Store original font sizes on mount
  useEffect(() => {
    const articleContainer = document.querySelector(".article-container");
    if (articleContainer) {
      const allElements = articleContainer.querySelectorAll("*");
      allElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const currentFontSize = computedStyle.fontSize;
        if (!originalFontSizes.has(element)) {
          originalFontSizes.set(element, currentFontSize);
        }
      });
    }
  }, [originalFontSizes]);

  // Apply theme classes to body
  useEffect(() => {
    document.body.classList.toggle("dark-theme", isdark);
    document.body.classList.toggle("light-theme", !isdark);
  }, [isdark]);

  // Font size adjustment functions
  const updateFontSizes = (percentage) => {
    const articleContainer = document.querySelector(".article-container");
    if (articleContainer) {
      const allElements = articleContainer.querySelectorAll("*");
      allElements.forEach((element) => {
        const originalSize = parseFloat(originalFontSizes.get(element)) / 16; // Assuming 16px base
        const newFontSize = originalSize * (percentage / 100);
        element.style.fontSize = `${newFontSize}rem`;
      });
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 200) {
      const newSize = fontSize + 10;
      setFontSize(newSize);
      updateFontSizes(newSize);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 100) {
      const newSize = fontSize - 10;
      setFontSize(newSize);
      if (newSize === 100) {
        originalFontSizes.forEach((size, element) => {
          element.style.fontSize = size;
        });
      } else {
        updateFontSizes(newSize);
      }
    }
  };

  // Font family change
  const fontFamilies = [
    "'Georgia', 'Times New Roman', Times, serif",
    "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
    "'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif",
  ];

  const changeFontFamily = (index) => {
    document.body.style.fontFamily = fontFamilies[index];
  };

  // Text-to-speech functions
  const speak = () => {
    setPlaying("on");
    utterance.text =
      document.querySelector(".article-container")?.innerText || "No content";
    utterance.voice = speechSynthesis.getVoices()[0];
    speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    setPlaying("pause");
    speechSynthesis.pause();
  };

  const playSpeech = () => {
    setPlaying("on");
    speechSynthesis.resume();
  };

  const resetSpeech = () => {
    setPlaying("none");
    speechSynthesis.cancel();
  };

  // Group Component
  const Group = ({ label, children }) => (
    <div className="group">
      <div className="group-controls">{children}</div>
      <div className="group-label">{label}</div>
    </div>
  );

  // FontFamilyDropdown Component
  const FontFamilyDropdown = ({ changeFontFamily }) => {
    const [open, setOpen] = useState(false);
    const options = [
      { name: "Georgia", style: fontFamilies[0] },
      { name: "Arial", style: fontFamilies[1] },
      { name: "OpenDyslexic", style: fontFamilies[2] },
    ];

    return (
      <div className="dropdown">
        <button onClick={() => setOpen(!open)} title="Select font family">
          Font Family
        </button>
        {open && (
          <div className="dropdown-list">
            {options.map((font, index) => (
              <button
                key={index}
                onClick={() => {
                  changeFontFamily(index);
                  setOpen(false);
                }}
                style={{ fontFamily: font.style }}
              >
                {font.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // FontSizeControls Component
  const FontSizeControls = ({ fontSize, increase, decrease }) => (
    <div className="font-size-controls">
      <button onClick={decrease} title="Decrease font size">
        <AiOutlineMinus />
      </button>
      <span>{fontSize}%</span>
      <button onClick={increase} title="Increase font size">
        <AiOutlinePlus />
      </button>
    </div>
  );

  // Panel Components
  const HomePanel = () => (
    <div className="panel">
      <Group label="Font">
        <FontFamilyDropdown changeFontFamily={changeFontFamily} />
        <FontSizeControls
          fontSize={fontSize}
          increase={increaseFontSize}
          decrease={decreaseFontSize}
        />
      </Group>
    </div>
  );

  const ViewPanel = () => (
    <div className="panel">
      <Group label="Theme">
        <button title="Light theme" onClick={() => toggleIsDark(false)}>
          <BsSun />
        </button>
        <button title="Dark theme" onClick={() => toggleIsDark(true)}>
          <BsMoon />
        </button>
      </Group>
    </div>
  );

  const AudioPanel = () => (
    <div className="panel">
      <Group label="Text-to-Speech">
        {playing === "none" && (
          <button title="Play audio" onClick={speak}>
            <AiOutlinePlayCircle />
          </button>
        )}
        {playing === "on" && (
          <button title="Pause audio" onClick={pauseSpeech}>
            <AiOutlinePauseCircle />
          </button>
        )}
        {playing === "pause" && (
          <button title="Resume audio" onClick={playSpeech}>
            <AiOutlinePlayCircle />
          </button>
        )}
        <button title="Stop audio" onClick={resetSpeech}>
          <AiOutlineStop />
        </button>
      </Group>
    </div>
  );

  const HelpPanel = () => (
    <div className="panel">
      <Group label="About">
        <button
          title="About this application"
          onClick={() => alert("Accessibility Ribbon v1.0")}
        >
          <AiOutlineInfoCircle />
        </button>
        <button
          title="Show/Hide accessibility"
          onClick={() => toggleAccessibility(!showAccessibility)}
        >
          {showAccessibility ? "Hide accessibility" : "Show accesibility"}
        </button>
      </Group>
    </div>
  );

  // Tab Definitions
  const tabs = [
    { name: "Home", panel: <HomePanel /> },
    { name: "View", panel: <ViewPanel /> },
    { name: "Audio", panel: <AudioPanel /> },
    { name: "Help", panel: <HelpPanel /> },
  ];

  return (
    <div className="ribbon">
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={activeTab === tab.name ? "active" : ""}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
            {activeTab === tab.name ? <AiOutlineUp /> : <AiOutlineDown />}
          </button>
        ))}
        <TopbarWithMenu
          playing={playing}
          speak={speak}
          pauseSpeech={pauseSpeech}
          playSpeech={playSpeech}
          resetSpeech={resetSpeech}
          changeFontFamily={changeFontFamily}
          fontSize={fontSize}
          increaseFontSizeByPercentage={increaseFontSize}
          decreaseFontSizeByPercentage={decreaseFontSize}
        />
      </div>
      <div className="ribbon-content">
        {tabs.find((tab) => tab.name === activeTab).panel}
      </div>
    </div>
  );
};

export default Ribbon;
