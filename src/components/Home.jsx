import { Parallax } from "react-parallax";
import cover from "../assets/cover2.jpg";
import Features from "./Features";
import SearchBar from "./SearchComp/SearchBar";

const Home = () => {
  return (
    <>
      <div className="mt-[-100px] mb-6 relative">
        <div className="relative">
          <Parallax
            bgImage={cover}
            bgImageAlt="cover"
            strength={300}
            className=""
            bgImageStyle={{ objectFit: "cover", objectPosition: "center" }}
          >
            <div className="h-[450px]"></div>
          </Parallax>

          {/* Overlaying SearchBar */}
          <div className="absolute bottom-0 w-full flex justify-center translate-y-1/2 ">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="mt-50 sm:mt-20">
        <Features />
      </div>
    </>
  );
};

export default Home;
