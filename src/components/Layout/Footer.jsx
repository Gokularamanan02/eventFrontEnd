import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white mt-12">
      <div className="container mx-auto py-6 px-6 flex flex-col md:flex-row justify-between items-center">
        <p>© 2025 Symposium. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-yellow-300 transition">
            Twitter
          </a>
          <a href="#" className="hover:text-yellow-300 transition">
            LinkedIn
          </a>
          <a href="#" className="hover:text-yellow-300 transition">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
