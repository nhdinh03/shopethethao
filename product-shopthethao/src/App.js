import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
// import Home from './pages/Home';
// import Products from './pages/Products';
// import Categories from './pages/Categories';
// import Accounts from './pages/Accounts';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      {/* <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/accounts" element={<Accounts />} /> */}
    </Routes>
  </Router>
);

export default App;
