import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./router";
import LayoutPageDefault from "./layouts/LayoutPageDefault";
import NotFound from "./pages/NotFound/notFound";
import { PrivateRoute } from "components/User";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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
      <ScrollToTop />
      <Routes>
        {renderPublicRoutes(publicRoutes)}
        {renderPrivateRoutes(privateRoutes)}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
