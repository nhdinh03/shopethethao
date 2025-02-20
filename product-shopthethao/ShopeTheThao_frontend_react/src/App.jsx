import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./router";
import LayoutPageDefault from "./layouts/LayoutPageDefault";
import PrivateRoute from "./components/Auth/PrivateRoute";

const App = () => {
  const renderPublicRoutes = (routes) => {
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

  const renderPrivateRoutes = (routes) => {
    return routes.map(({ path, component: Component, layout: Layout }, index) => {
      const LayoutWrapper = Layout || LayoutPageDefault;
      return (
        <Route
          key={index}
          path={path}
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <Component />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
      );
    });
  };

  return (
    <Router>
      <Routes>
        {renderPublicRoutes(publicRoutes)}
        {renderPrivateRoutes(privateRoutes)}
      </Routes>
    </Router>
  );
};

export default App;
