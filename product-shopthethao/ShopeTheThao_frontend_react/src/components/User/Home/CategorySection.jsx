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
        staggerChildren: 0.05,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Mock data for categories
  const categories = [
    {
      id: 1,
      name: "Áo thể thao",
      description: "Thoáng mát, năng động",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      count: "150+ sản phẩm"
    },
    {
      id: 2,
      name: "Giày thể thao",
      description: "Êm ái, bền bỉ",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
      count: "200+ sản phẩm"
    },
    {
      id: 3,
      name: "Quần jeans",
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 4,
      name: "Giày",
      image:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 5,
      name: "Giày",
      image:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 6,
      name: "Giày",
      image:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ];

  return (
    <section className="categories-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>DANH MỤC NỔI BẬT</h2>
          <p>Khám phá các danh mục sản phẩm thể thao hàng đầu</p>
        </motion.div>

        <motion.div
          className="categories-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="category-card"
              variants={childVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
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
                <Link to={`/category/${category.id}`} className="category-link">
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
