import React from "react";

const OfficerInterest = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-white">
      <h2 className="mb-4 text-3xl font-semibold italic md:text-4xl">
        Officer Application
      </h2>
      <p
        className="mb-4 w-full max-w-lg text-center"
        style={{ color: "#B8B8B8" }}
      >
        Do you believe you personify these core values and are committed to
        helping us grow TAMU ThinkTank for future students?
      </p>
      <a
        href="#"
        className="rounded-full border border-white px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-white hover:text-black"
      >
        Apply Now ›
      </a>
      <div style={{ padding: "10px" }}></div>
    </div>
  );
};

export default OfficerInterest;
