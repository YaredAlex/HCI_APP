import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ArticleContextProvider from "./context/article_context.jsx";

createRoot(document.getElementById("root")).render(
  <ArticleContextProvider>
    <App />
  </ArticleContextProvider>
);
