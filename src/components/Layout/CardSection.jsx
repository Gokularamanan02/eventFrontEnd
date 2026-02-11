import React from "react";
import "../../styles/SummaryCards.css";
const services = [
  {
    title: "Venue Selection",
    desc: "Beautiful venues that match your dream wedding.",
  },
  {
    title: "Decoration",
    desc: "Elegant and romantic decoration themes.",
  },
  {
    title: "Photography",
    desc: "Capture your most precious moments forever.",
  },
];

const CardSection = () => {
  return (
    <section className="py-20 bg-[#faf7f5]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-serif font-bold text-gray-800">
            Our Services
          </h2>
          <p className="text-gray-600 mt-3">
            Designed with love and perfection
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 text-center"
            >
              <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardSection;
