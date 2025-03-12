import { useState } from "react";
import ReactLoading from "react-loading";
import "./App.css";
import Accessibility from "./access";
import axios from "axios";
import { useArticleContext } from "./context/article_context";
import RibbonTab from "./components/ribbon_tab";

function App() {
  const [contentUrl, setContentUrl] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { changeArticle, isdark } = useArticleContext();
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
          changeArticle(res.data.text);
        }
      })
      .catch((e) => alert(JSON.stringify(e)))
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <main className="">
      {/* accessibility option bottom-left */}
      <Accessibility />
      {/* Topbar */}
      <RibbonTab />
      {/* <TopbarWithAccessebility /> */}
      {/* Topbar with menu */}
      {/* <TopbarWithMenu /> */}
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
