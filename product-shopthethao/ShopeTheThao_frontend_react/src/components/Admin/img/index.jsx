import React, { useState } from "react";
import { Image } from "antd";

const ImageSwitcher = ({ image1, image2 }) => {
  const [showFirst, setShowFirst] = useState(true);

  return (
    <div
      style={{
        position: "relative",
        width: "105px",
        height: "80px",
        cursor: "pointer",
      }}
      onMouseEnter={() => setShowFirst(false)} // Khi rê chuột vào, đổi sang ảnh 2
      onMouseLeave={() => setShowFirst(true)}  // Khi rời chuột, đổi về ảnh 1
    >
      {image1 ? (
        <Image
          width={105}
          height={80}
          style={{
            objectFit: "contain",
            position: "absolute",
            top: 0,
            left: 0,
            opacity: showFirst ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          alt="Ảnh 1"
          src={image1}
        />
      ) : null}

      {image2 ? (
        <Image
          width={105}
          height={80}
          style={{
            objectFit: "contain",
            position: "absolute",
            top: 0,
            left: 0,
            opacity: showFirst ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
          alt="Ảnh 2"
          src={image2}
        />
      ) : null}
    </div>
  );
};

export default ImageSwitcher;
