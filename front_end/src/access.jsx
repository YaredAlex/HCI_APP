import React, { useState, useEffect } from "react";
import "./access.css";
import { AiOutlineClose, AiOutlineSetting } from "react-icons/ai";
const Accessibility = () => {
  const [isWindowVisible, setIsWindowVisible] = useState(false);
  const [activeActions, setActiveActions] = useState({});

  const accColor = [
    {
      icon: "/assets/invert_color.png",
      text: "Invert color",
      performAction: () => {
        document.body.classList.toggle("invert-filter");
      },
    },
    {
      icon: "/assets/brightness.png",
      text: "Brightness",
      performAction: () => {
        let currentBrightness = parseFloat(
          document.body.style.filter.match(/brightness\(([^)]+)\)/)?.[1] || 1
        );
        document.body.style.filter = `brightness(${
          currentBrightness < 1.5 ? currentBrightness + 0.5 : 1
        })`;
      },
    },
    {
      icon: "/assets/contrast.png",
      text: "Contrast",
      performAction: () => {
        let currentContrast = parseFloat(
          document.body.style.filter.match(/contrast\(([^)]+)\)/)?.[1] || 1
        );
        document.body.style.filter = `contrast(${
          currentContrast < 2 ? currentContrast + 0.5 : 1
        })`;
      },
    },
    {
      icon: "/assets/saturation.png",
      text: "Saturation",
      performAction: () => {
        let currentSaturation = parseFloat(
          document.body.style.filter.match(/saturate\(([^)]+)\)/)?.[1] || 1
        );
        document.body.style.filter = `saturate(${
          currentSaturation < 2 ? currentSaturation + 0.5 : 1
        })`;
      },
    },
    {
      icon: "/assets/gray_scale.png",
      text: "Gray Scale",
      performAction: () => {
        document.body.style.filter =
          document.body.style.filter === "grayscale(1)"
            ? "none"
            : "grayscale(1)";
      },
    },
  ];

  const accContent = [
    {
      icon: "/assets/bigger_text.png",
      text: "Bigger Text",
      performAction: () => {
        document.body.style.fontSize =
          document.body.style.fontSize === "large" ? "initial" : "large";
      },
    },
    {
      icon: "/assets/bigger_cursor.png",
      text: "Bigger Cursor",
      performAction: () => {
        console.log(document.body.style.cursor);
        document.body.style.cursor =
          document.body.style.cursor === "default" ||
          document.body.style.cursor === ""
            ? "url('/assets/cursor.png'), auto"
            : "default";
      },
    },
    // {
    //   icon: "/assets/tool_tip.png",
    //   text: "Tooltip",
    //   performAction: () => {
    //     const elements = document.querySelectorAll("*[title]");
    //     elements.forEach((el) => {
    //       if (!el.dataset.originalTitle) {
    //         el.dataset.originalTitle = el.title;
    //         el.title = `Tooltip: ${el.title}`;
    //       } else {
    //         el.title = el.dataset.originalTitle;
    //         el.removeAttribute("data-original-title");
    //       }
    //     });
    //   },
    // },
    // {
    //   icon: "/assets/bionic_reading.png",
    //   text: "Bionic Reading",
    //   performAction: () => {
    //     const textNodes = document.createTreeWalker(
    //       document.body,
    //       NodeFilter.SHOW_TEXT
    //     );
    //     while (textNodes.nextNode()) {
    //       const node = textNodes.currentNode;
    //       if (!node.parentNode.dataset.bionic) {
    //         node.parentNode.dataset.bionic = true;
    //         const words = node.textContent.split(" ");
    //         node.replaceWith(
    //           ...words.map((word) => {
    //             const span = document.createElement("span");
    //             span.innerHTML = `<b>${word.slice(
    //               0,
    //               Math.ceil(word.length / 2)
    //             )}</b>${word.slice(Math.ceil(word.length / 2))}`;
    //             return span;
    //           })
    //         );
    //       }
    //     }
    //   },
    // },
    {
      icon: "/assets/hiding_image.png",
      text: "Hide Image",
      performAction: () => {
        const images = document.querySelectorAll("img");
        images.forEach((img) => {
          img.style.visibility =
            img.style.visibility === "hidden" ? "visible" : "hidden";
        });
      },
    },
    {
      icon: "/assets/stop_animation.png",
      text: "Stop Animation",
      performAction: () => {
        const animations = document.querySelectorAll("*");
        animations.forEach((el) => {
          const animationState = getComputedStyle(el).animationPlayState;
          el.style.animationPlayState =
            animationState === "paused" ? "running" : "paused";
        });
      },
    },
    {
      icon: "/assets/line_height.png",
      text: "Line Height",
      performAction: () => {
        document.body.style.lineHeight =
          document.body.style.lineHeight === "2" ? "1.5" : "2";
      },
    },
    {
      icon: "/assets/highlight_link.png",
      text: "Highlight Links",
      performAction: () => {
        const links = document.querySelectorAll("a");
        links.forEach((link) => {
          link.style.backgroundColor =
            link.style.backgroundColor === "yellow" ? "transparent" : "yellow";
        });
      },
    },
  ];

  const toggleWindow = () => setIsWindowVisible(!isWindowVisible);

  const handleActionClick = (action, text) => {
    action();
    setActiveActions((prev) => ({
      ...prev,
      [text]: !prev[text],
    }));
  };

  return (
    <>
      {/* Floating Button */}
      {!isWindowVisible && (
        <button
          id="floating_btn"
          className="cursor_pointer accessibility"
          onClick={toggleWindow}
        >
          <span className="accessibility">
            <img src="/assets/person.png" alt="accessibility" />
          </span>
        </button>
      )}

      {/* Accessibility Window */}
      {isWindowVisible && (
        <div id="accessibility_window" className="show accessibility">
          {/* Header */}
          <div id="accessibility_option" className="bg-primary accessibility">
            <div className="acc-header accessibility">
              <h4 className="accessibility">Accessibility Options</h4>
              <div className="acc-control accessibility">
                {/* <div className="img-container">
                  <AiOutlineSetting />
                </div> */}
                <div
                  className="img-container cursor_pointer accessibility"
                  id="close_btn"
                  onClick={toggleWindow}
                >
                  <AiOutlineClose
                    className="accessibility"
                    width={32}
                    height={32}
                    size={"md"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color Section */}
          <div className="acc-container accessibility">
            <p
              className="accessibility"
              style={{ marginTop: "12px", marginLeft: "12px" }}
            >
              Color
            </p>
            <section id="accessibility_color" className="accessibility">
              {accColor.map(({ icon, text, performAction }) => (
                <div
                  key={text}
                  className={`card cursor_pointer accessibility ${
                    activeActions[text] ? "active" : ""
                  }`}
                  onClick={() => handleActionClick(performAction, text)}
                >
                  <div className="img-container accessibility">
                    <img src={icon} alt={text} />
                  </div>
                  <p className="accessibility">{text}</p>
                </div>
              ))}
            </section>
          </div>

          {/* Content Section */}
          <div className="acc-container accessibility">
            <p
              className="accessibility"
              style={{ marginTop: "12px", marginLeft: "12px" }}
            >
              Content
            </p>
            <section id="accessibility_content">
              {accContent.map(({ icon, text, performAction }) => (
                <div
                  key={text}
                  className={`card cursor_pointer accessibility ${
                    activeActions[text] ? "active" : ""
                  }`}
                  onClick={() => handleActionClick(performAction, text)}
                >
                  <div className="img-container accessibility">
                    <img src={icon} alt={text} />
                  </div>
                  <p className="accessibility">{text}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default Accessibility;
