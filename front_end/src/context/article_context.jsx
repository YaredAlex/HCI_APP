import React, { useContext, useState } from "react";

const ArticleContext = React.createContext();
const ArticleContextProvider = ({ children }) => {
  const [isdark, setIsdark] = useState(true);
  const [article, setArticle] = useState("No data found");
  const toggleIsDark = (value) => {
    setIsdark(value);
  };
  const changeArticle = (data) => setArticle(data);
  return (
    <ArticleContext.Provider
      value={{ isdark, toggleIsDark, article, changeArticle }}
    >
      {children}
    </ArticleContext.Provider>
  );
};
export const useArticleContext = () => useContext(ArticleContext);

export default ArticleContextProvider;
