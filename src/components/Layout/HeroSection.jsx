import bgImage from "@/assets/hero/signypbg.png";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Soft overlay like Astra wedding template */}
      <div className="absolute inset-0 bg-white/40"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            Wedding Planner
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Creating timeless memories for your special day
          </p>
          <button className="bg-pink-500 text-white px-8 py-3 rounded-md text-lg hover:bg-pink-600 transition">
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
