import React from 'react';

export default function ApplyBanner() {
  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto flex justify-center items-center p-4">
        <p className="text-lg font-medium mr-4">‘24–25 Design Challenge Applications Now Open!</p>
        <a
          href="#"
          className="px-4 py-2 border border-white text-white rounded-full hover:bg-white hover:text-black transition duration-300 ease-in-out"
        >
          Apply Now ›
        </a>
      </div>
    </div>
  );
}
