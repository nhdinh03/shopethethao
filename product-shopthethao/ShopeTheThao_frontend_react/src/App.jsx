import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./router";
import LayoutPageDefault from "./layouts/LayoutPageDefault";

const App = () => {
  const renderRoutes = (routes) => {
    return routes.map(({ path, component: Component, layout: Layout }, index) => {
      const LayoutWrapper = Layout || LayoutPageDefault;
      return (
        <Route
          key={index}
          path={path}
          element={
            <LayoutWrapper>
              <Component />
            </LayoutWrapper>
          }
        />
      );
    });
  };

  return (
    <Router>
      <Routes>
        {renderRoutes(publicRoutes)}
        {renderRoutes(privateRoutes)}
      </Routes>
    </Router>
  );
};

export default App;
