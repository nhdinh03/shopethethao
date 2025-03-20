import React, { useState, useEffect, Suspense, useCallback } from "react";

import "./Home.scss";

import { BrandSection, Slideshow ,CategorySection} from "components/User";

import Loading from "pages/Loading/loading";

import { mockProducts, categories, brands } from "data/mockData";
import { noibatdata } from "data/noibatdata";





const HomeIndex = () => {
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    brand: [],
    priceRange: 2000000,
  });


  const [products, setProducts] = useState([]);
 
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 5000000],
    sort: "popular",
  });

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Handle price range changes
  const handlePriceRangeChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [0, parseInt(value)],
    }));
  };



  // Apply filters
  const applyFilters = useCallback(() => {
    let result = [...products];

    // Category filter
    if (filters.categories.length) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Brand filter
    if (filters.brands.length) {
      result = result.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    // Price range
    result = result.filter((product) => {
      const finalPrice = product.discountPercentage
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;
      return (
        finalPrice >= filters.priceRange[0] &&
        finalPrice <= filters.priceRange[1]
      );
    });

    // Sorting
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [filters, products]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  // Handle filter changes


  // Separate data loading for products and featured products
  useEffect(() => {
    // Load regular products - limit to 5 products
    const topProducts = mockProducts.slice(0, 5);
    setProducts(mockProducts); // Keep full list for filtering
    setFilteredProducts(topProducts);
    setDisplayedProducts(topProducts);
    setLoading(false);

    // Load featured products - limit to 5 products
    if (noibatdata && noibatdata.length > 0) {
      setFeaturedProducts(noibatdata.slice(0, 5));
    } else {
      const featured = mockProducts
        .filter(product => product.isBestSeller || product.isNew)
        .slice(0, 5);
      setFeaturedProducts(featured);
    }
    setLoading(false);
  }, []);


  return (
    <div className="home-page">
      {/* Use the optimized Slideshow component */} 
      <Slideshow/>

      {/* Lazy loaded components */}
      <Suspense fallback={<Loading />}>
        <CategorySection />
      </Suspense>


      <Suspense fallback={<Loading />}>
        <BrandSection />
      </Suspense>
    </div>
  );
};

export default HomeIndex;
