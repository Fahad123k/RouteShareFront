import React from "react";
import cover from "../assets/cover.jpeg";

import Features from "./Features";
import SearchBar from "./SearchComp/SearchBar";


const Home = () => {
  return (
    <>
      <div className="mt-6">
        <div
          className="overflow-hidden w-full rounded-lg"
          style={{ position: "relative" }}
        >
          <img
            src={cover}
            alt="Banner"
            className="object-cover w-full h-full"
          />
        <SearchBar/>
        </div>
      </div>



      <Features />
    </>
  );
};

export default Home;
