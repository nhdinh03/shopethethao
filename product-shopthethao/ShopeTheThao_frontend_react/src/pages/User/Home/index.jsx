import React, { Suspense } from "react";

import "./Home.scss";
import { Slideshow } from "components/User";
import Loading from "pages/Loading/loading";

const HomeIndex = () => {
  return (
    <div className="home-page">
      <Suspense fallback={<Loading />}>
        <Slideshow />
      </Suspense>
    </div>
  );
};

export default HomeIndex;
