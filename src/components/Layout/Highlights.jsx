import React from "react";
import { FaLaptopCode, FaBookOpen, FaChalkboardTeacher, FaTrophy } from "react-icons/fa";

const highlights = [
  {
    icon: <FaLaptopCode size={40} className="text-indigo-600" />,
    title: "Hackathon",
    description: "24-hour team coding challenge to innovate.",
  },
  {
    icon: <FaBookOpen size={40} className="text-green-600" />,
    title: "Paper Presentation",
    description: "Present your research ideas to experts.",
  },
  {
    icon: <FaChalkboardTeacher size={40} className="text-yellow-600" />,
    title: "Workshops",
    description: "Hands-on sessions by industry professionals.",
  },
  {
    icon: <FaTrophy size={40} className="text-red-600" />,
    title: "Coding Contest",
    description: "Test your problem-solving and coding skills.",
  },
];

const Highlights = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
        Symposium Highlights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 text-center hover:scale-105 transition"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlights;
