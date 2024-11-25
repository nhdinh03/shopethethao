import React from "react";

const globalStyles = {
  body: {
    margin: 0,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', " +
      "'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  code: {
    fontFamily:
      "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
};




const App = () => {
  // Apply body styles on mount
  React.useEffect(() => {
    Object.assign(document.body.style, globalStyles.body);
  }, []);

  return (
    <div>
      <p>
        
        Edit <code style={globalStyles.code}>src/App.js</code> and save to
        reload.
      </p>
    </div>
  );
};

export default App;
