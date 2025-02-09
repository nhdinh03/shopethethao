import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./router";
import LayoutPageDefault from "./layouts/LayoutPageDefault/";
// import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(
          ({ path, component: Component, layout: Layout }, index) => {
            const LayoutWrapper = Layout || LayoutPageDefault; // Nếu không có layout thì dùng mặc định
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
          }
        )}

        {/* Private Routes (Yêu cầu đăng nhập) */}
        {privateRoutes.map(
          ({ path, component: Component, layout: Layout }, index) => {
            const LayoutWrapper = Layout || LayoutPageDefault; // Nếu không có layout thì dùng mặc định
            return (
              <Route
                key={index}
                path={path}
                element={
                  // <ProtectedRoute>
                  <LayoutWrapper>
                    <Component />
                  </LayoutWrapper>
                  // </ProtectedRoute>
                }
              />
            );
          }
        )}
      </Routes>
    </Router>
  );
};

export default App;
