import React from "react";
import { motion } from "framer-motion";

const BrandSection = () => {
  // Mock data for brands
  const brands = [
    "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/Puma-logo-%28text%29.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/35/Chanel_logo.svg",
  ];

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

  return (
    <section className="brands-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>THƯƠNG HIỆU NỔI BẬT</h2>
          <p>
            Chúng tôi hợp tác với các thương hiệu thể thao hàng đầu thế giới
          </p>
        </motion.div>

        <motion.div
          className="brands-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              className="brand-logo"
              variants={childVariants}
            >
              <img src={brand} alt={`Brand ${index + 1}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandSection;
