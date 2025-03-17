import React from "react";
import { motion } from "framer-motion";

const PromoBanner = () => {
  return (
    <section className="promo-banner">
      <div className="container">
        <div className="promo-content">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            GIẢM GIÁ CUỐI MÙA
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Giảm giá đến 50% cho tất cả các sản phẩm mùa hè
          </motion.p>
          <motion.button
            className="shop-now-btn"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Mua ngay
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
