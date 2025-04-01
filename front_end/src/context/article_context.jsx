import React, { useContext, useState } from "react";

const ArticleContext = React.createContext();
const ArticleContextProvider = ({ children }) => {
  const [isdark, setIsdark] = useState(true);
  const [article, setArticle] = useState("No data found");
  const [showAccessibility, setShowAccessibility] = useState(true);
  const toggleIsDark = (value) => {
    setIsdark(value);
  };
  const changeArticle = (data) => setArticle(data);
  const toggleAccessibility = (data) => setShowAccessibility(data);
  return (
    <ArticleContext.Provider
      value={{
        isdark,
        toggleIsDark,
        article,
        changeArticle,
        showAccessibility,
        toggleAccessibility,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};
export const useArticleContext = () => useContext(ArticleContext);

export default ArticleContextProvider;
