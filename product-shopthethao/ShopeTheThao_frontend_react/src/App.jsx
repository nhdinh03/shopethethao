import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './router';

const App = () => (
  <Router>
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map(({ path, component: Component, layout: Layout }, index) => (
        <Route key={index} path={path} element={<Layout><Component /></Layout>} />
      ))}

      {/* Private Routes */}
      {privateRoutes.map(({ path, component: Component, layout: Layout }, index) => (
        <Route key={index} path={path} element={<Layout><Component /></Layout>} />
      ))}
    </Routes>
  </Router>
);

export default App;
