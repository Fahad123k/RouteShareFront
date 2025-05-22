import React from "react";
import { FaMoneyBillWave, FaTruck, FaUsers, FaClock, FaHandshake, FaLeaf } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      title: "Cost Optimization",
      description:
        "The application enables users to send parcels at reduced rates by leveraging unused vehicle space that would otherwise go to waste.",
      icon: <FaMoneyBillWave className="text-green-500 text-4xl mb-4" />,
    },
    {
      title: "Efficient Space Utilisation",
      description:
        "Vehicle owners can utilise vacant space during their trips to transport additional items, maximizing the efficiency and utility of their vehicles.",
      icon: <FaTruck className="text-blue-500 text-4xl mb-4" />,
    },
    {
      title: "User-Transporter Connection",
      description:
        "The platform connects users needing to ship goods with vehicle owners (transporters or travellers) who have spare space, fostering seamless collaboration.",
      icon: <FaUsers className="text-purple-500 text-4xl mb-4" />,
    },
    {
      title: "Real-Time Scheduling",
      description:
        "Transporters can post their travel schedules, specifying departure and destination locations along with the available space. Users can browse these schedules and request to use the space for parcel delivery along the same route.",
      icon: <FaClock className="text-yellow-500 text-4xl mb-4" />,
    },
    {
      title: "Mutual Benefits",
      description:
        "Vehicle owners earn extra income by transporting parcels, while users save money on shipping costs by taking advantage of existing vehicle routes.",
      icon: <FaHandshake className="text-pink-500 text-4xl mb-4" />,
    },
    {
      title: "Environmental Impact",
      description:
        "By reducing the number of separate delivery trips, this system helps minimise the overall carbon footprint of transportation.",
      icon: <FaLeaf className="text-green-600 text-4xl mb-4" />,
    },
  ];

  return (
    <>
      <div className="w-full p-4 text-center mt-3">
        {/* Enhanced Heading Design */}
        <h6 className="text-3xl font-bold text-gray-800 relative inline-block">
          Why RouteShare ?
          <span className="absolute left-0 bottom-[-6px] w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-lg"></span>
        </h6>
        <p className="text-gray-600 mt-2">
          Explore the unique features that make our platform innovative and impactful.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6" style={{ padding: '0 10%' }}>
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 bg-white text-center"
          >
            {feature.icon}
            <h6 className="font-semibold text-gray-800">
              {feature.title}
            </h6>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Features;
