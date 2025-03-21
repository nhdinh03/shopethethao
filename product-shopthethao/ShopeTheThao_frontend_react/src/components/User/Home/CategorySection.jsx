import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const CategorySection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      },
    },
  };

  // Enhanced data for categories with high-quality images
  const categories = [
    {
      id: 1,
      name: "Áo thể thao",
      description: "Thoáng mát, năng động",
      image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/49ee2f3f-847c-4bf8-8642-35619de8ce9f/sportswear-club-t-shirt-KBwTCk.png",
      count: "150+ sản phẩm",
      slug: "ao-the-thao"
    },
    {
      id: 2,
      name: "Giày thể thao",
      description: "Êm ái, bền bỉ",
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/15f901c90a9549d29104aae700d27efb_9366/Ultraboost_Light_Running_Shoes_Black_HQ6351_01_standard.jpg",
      count: "200+ sản phẩm",
      slug: "giay-the-thao"
    },
    {
      id: 3,
      name: "Quần thể thao",
      description: "Co giãn thoải mái",
      image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/d9e88f18-f275-4966-93c2-6043cbf94460/sportswear-club-fleece-joggers-KflRdQ.png",
      count: "120+ sản phẩm",
      slug: "quan-the-thao"
    },
    {
      id: 4,
      name: "Áo khoác thể thao",
      description: "Chống gió, nhẹ nhàng",
      image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/3f2a3e5e-1bd1-4228-a302-f8ad7d904e83/sportswear-windrunner-jacket-K9c2dt.png",
      count: "80+ sản phẩm",
      slug: "ao-khoac-the-thao"
    },
    {
      id: 5,
      name: "Phụ kiện thể thao",
      description: "Đa dạng, tiện lợi",
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fc8430c129234752b9c0acb30127b353_9366/Classic_3-Stripes_Backpack_Black_FT8764_01_standard.jpg",
      count: "300+ sản phẩm",
      slug: "phu-kien-the-thao"
    },
    {
      id: 6,
      name: "Đồ bơi",
      description: "Năng động, thời trang",
      image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7fa70085-3254-4cc0-a790-437657ebab0a/6-volley-swim-shorts-LJmGnm.png",
      count: "70+ sản phẩm",
      slug: "do-boi"
    },
  ];

  return (
    <section className="categories-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2>DANH MỤC NỔI BẬT</h2>
          <p>Khám phá các danh mục sản phẩm thể thao hàng đầu cho mọi hoạt động</p>
        </motion.div>

        <motion.div
          className="categories-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="category-card"
              variants={childVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <span className="product-count">{category.count}</span>
                </div>
              </div>
              <div className="category-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <Link to={`/category/${category.slug}`} className="category-link">
                  Khám phá ngay <FiArrowRight />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;
