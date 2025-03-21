import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BrandSection = () => {
  // Enhanced brand data with links and descriptions
  const brands = [
    {
      name: "Adidas",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
      description: "Performance, passion, integrity",
      link: "/brands/adidas"
    },
    {
      name: "Nike",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
      description: "Just do it",
      link: "/brands/nike"
    },
    {
      name: "Puma",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Puma-logo-%28text%29.svg",
      description: "Forever faster",
      link: "/brands/puma"
    },
    {
      name: "Under Armour",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg",
      description: "Under Armour makes you better",
      link: "/brands/under-armour"
    },
    {
      name: "New Balance",
      logo: "https://1000logos.net/wp-content/uploads/2017/05/New-Balance-logo.png",
      description: "Always in beta",
      link: "/brands/new-balance"
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        ease: "easeOut"
      },
    },
  };

  return (
    <section className="brands-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2>THƯƠNG HIỆU NỔI BẬT</h2>
          <p>
            Chúng tôi hợp tác với các thương hiệu thể thao hàng đầu thế giới để mang đến sản phẩm chất lượng cao
          </p>
        </motion.div>

        <motion.div
          className="brands-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              className="brand-logo-card"
              variants={childVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <Link to={brand.link}>
                <div className="brand-logo">
                  <img src={brand.logo} alt={brand.name} />
                </div>
                <div className="brand-info">
                  <h3>{brand.name}</h3>
                  <p>{brand.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandSection;
