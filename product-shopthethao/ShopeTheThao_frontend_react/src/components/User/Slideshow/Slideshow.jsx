import { memo } from "react";
import { Slide } from "react-slideshow-image";
import { useNavigate } from "react-router-dom";
import "react-slideshow-image/dist/styles.css";
import "./slideshow.scss";

// Default slide images with high-quality placeholder images
const DEFAULT_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    caption: "Phong Cách Thể Thao Hiện Đại",
    link: "/category/sportswear",
  },
  {
    url: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    caption: "Thời Trang Năm 2025",
    link: "/new-arrivals",
  },
  {
    url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    caption: " Ưu Đãi Đặc Biệt",
    link: "/special-offers",
  },
];
// Define slideshow data
// const slideshowData = [
//   {
//     url: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//     caption: "Bộ Sưu Tập Mùa Hè 2023",
//     link: "/category/summer",
//   },
//   {
//     url: "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//     caption: "Giày Thể Thao Mới Nhất",
//     link: "/category/shoes",
//   },
//   {
//     url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//     caption: "Phong Cách Thể Thao Hiện Đại",
//     link: "/category/sportswear",
//   },
// ];

const Slideshow = ({ slides = DEFAULT_SLIDES }) => {
  const navigate = useNavigate();

  const handleShopNow = (link) => {
    navigate(link);
  };

  const properties = {
    duration: 3000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: false,
    pauseOnHover: true,
    easing: "ease",
  };

  return (
    <div className="slideshow-section">
      <div className="container">
        <div className="slide-container">
          <Slide {...properties}>
            {slides.map((slide, index) => (
              <div className="each-slide" key={index}>
                <div
                  style={{ backgroundImage: `url(${slide.url})` }}
                  role="img"
                  aria-label={slide.caption}
                >
                  <div className="slide-caption">
                    <h2>{slide.caption}</h2>
                    <button
                      className="shop-now"
                      onClick={() => handleShopNow(slide.link)}
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slide>
        </div>
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default Slideshow;
