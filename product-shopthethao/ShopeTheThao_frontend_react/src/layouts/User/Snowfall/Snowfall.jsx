// Snowfall.js
import React, { useEffect } from "react";
import styles from "./Snowfall.module.scss"; // Import SCSS cho tuyết

const Snowfall = () => {
  useEffect(() => {
    createSnowflakes();
  }, []);

  const createSnowflakes = () => {
    const container = document.querySelector(`.${styles.snowfall}`);
    const snowflakeCount = 10; // Số lượng bông tuyết
    const interval = 2000; // Khoảng thời gian tạo bông tuyết mới (2 giây)

    let createdSnowflakes = 0;

    const createSnowflake = () => {
      if (createdSnowflakes >= snowflakeCount) return;

      const snowflake = document.createElement("div");
      snowflake.className = styles.snowflake;
      snowflake.style.left = `${Math.random() * 100}vw`; // Random vị trí ngang
      snowflake.style.animationDuration = `${Math.random() * 10 + 5}s`; // Tốc độ rơi
      snowflake.style.animationDelay = `${Math.random() * 5}s`; // Delay ngẫu nhiên
      container.appendChild(snowflake);

      // Thêm sự kiện click để tạo hiệu ứng pháo hoa
      snowflake.addEventListener("click", () => {
        snowflake.classList.add(styles.fireworks); // Thêm class pháo hoa
        setTimeout(() => {
          snowflake.remove(); // Loại bỏ bông tuyết sau khi nổ
        }, 1000); // Sau 1s sẽ biến mất
      });

      createdSnowflakes++;
      setTimeout(createSnowflake, interval);
    };

    createSnowflake();
  };

  return <div className={styles.snowfall}></div>;
};

export default Snowfall;
