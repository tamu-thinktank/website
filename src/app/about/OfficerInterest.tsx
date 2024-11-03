import React from 'react';

const OfficerInterest = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-white">
      <h2 className="text-3xl font-semibold mb-4 italic md:text-4xl">
        Officer Application
      </h2>
      <p className="mb-4 text-center w-full max-w-lg" style={{ color: '#B8B8B8' }}>
        Do you believe you personify these core values and are committed to helping us grow TAMU ThinkTank for future students?
      </p>
      <a
        href="#"
        className="px-4 py-2 border border-white text-white rounded-full hover:bg-white hover:text-black transition duration-300 ease-in-out"
      >
        Apply Now ›
      </a>
    </div>
  );
};

export default OfficerInterest;