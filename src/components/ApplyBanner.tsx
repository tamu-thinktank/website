import React from "react";

export default function ApplyBanner() {
  return (
    <div className="apply-banner">
      <div className="container mx-auto flex items-center justify-center p-4">
        <p className="mr-4 text-base font-medium sm:text-lg">
          '24–25 Design Challenge Applications Now Open!
        </p>
        <a
          href="#"
          className="w-full rounded-full border border-white px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-white hover:text-black sm:w-auto"
        >
          Apply Now ›
        </a>
      </div>
    </div>
  );
}
