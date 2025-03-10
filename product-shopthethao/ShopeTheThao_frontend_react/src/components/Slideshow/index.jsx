import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "./slideshow.scss";

const slideImages = [
  {
    url: "https://example.com/slide1.jpg",
    caption: "Summer Collection 2024",
  },
  {
    url: "https://example.com/slide2.jpg",
    caption: "New Arrivals",
  },
  {
    url: "https://example.com/slide3.jpg",
    caption: "Special Offers",
  },
];

const Slideshow = () => {
  const properties = {
    duration: 3000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: false,
  };

  return (
    <div className="slideshow-section">
      <div className="container">
        <div className="slide-container">
          <Slide {...properties}>
            {slideImages.map((image, index) => (
              <div className="each-slide" key={index}>
                <div style={{ backgroundImage: `url(${image.url})` }}>
                  <div className="slide-caption">
                    <h2>{image.caption}</h2>
                    <button className="shop-now">Shop Now</button>
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

export default Slideshow;
