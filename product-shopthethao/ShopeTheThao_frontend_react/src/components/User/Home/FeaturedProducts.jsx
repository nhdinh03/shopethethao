import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ProductCard } from "components/User";
import { FiArrowRight } from "react-icons/fi";

const FeaturedProducts = ({ products }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <section className="featured-products">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>SẢN PHẨM BÁN CHẠY</h2>
          <Link to="/products" className="view-all">
            Xem tất cả <FiArrowRight />
          </Link>
        </motion.div>

        <motion.div
          className="products-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
