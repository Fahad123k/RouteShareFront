import { Parallax } from "react-parallax";
import cover from "../assets/cover2.jpg";
import Features from "./Features";
import SearchBar from "./SearchComp/SearchBar";
import { NavLink } from "react-router";

const Home = () => {
  return (
    <>
      <div className="mt-[-15px] mb-6 relative">
        <div className="relative">
          <Parallax
            bgImage={cover}
            bgImageAlt="cover"
            strength={300}
            bgImageStyle={{ objectFit: "cover", objectPosition: "center" }}
          >
            {/* Centering Content */}
            <div className="h-[350px] flex flex-col items-center justify-center text-center text-white px-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-8 shadow-lg">
                <h1 className="text-sm sm:text-3xl font-bold">Affordable Carpooling Parcel Service</h1>
                <p className="mt-2 text-sm  sm:text-lg">Deliver parcels at the lowest cost with real-time route sharing.</p>
                <button className="mt-4 px-6 py-2 bg-white text-blue-900 font-semibold rounded-full shadow-md hover:bg-blue-100 transition">
                  <NavLink to='/publish'>

                    Get Started
                  </NavLink>
                </button>
              </div>
            </div>


          </Parallax>



        </div>
      </div>

      <div className="mt-[-20px] z-50">

        <SearchBar />

        <Features />
      </div>
    </>
  );
};

export default Home;
