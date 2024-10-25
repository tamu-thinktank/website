"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from "@/components/AppHeader"; // Adjust path if needed
import AppFooter from "@/components/AppFooter"; // Adjust path if needed

const DesignChallenges: React.FC = () => {
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    const slideInElements = document.querySelectorAll('.slide-in');
    const bounceElements = document.querySelectorAll('.bounce');

    fadeInElements.forEach(el => {
      el.style.opacity = 0;
      el.style.transition = 'opacity 1s ease-in-out';
      setTimeout(() => {
        el.style.opacity = 1;
      }, 100);
    });

    slideInElements.forEach(el => {
      el.style.transform = 'translateY(-20px)';
      el.style.opacity = 0;
      el.style.transition = 'transform 1s ease-in-out, opacity 1s ease-in-out';
      setTimeout(() => {
        el.style.transform = 'translateY(0)';
        el.style.opacity = 1;
      }, 100);
    });

    const bounceKeyframes = [
      { transform: 'translateY(0)' },
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0)' }
    ];

    const bounceTiming = {
      duration: 2000,
      iterations: Infinity
    };

    bounceElements.forEach(el => {
      el.animate(bounceKeyframes, bounceTiming);
    });
  }, []);

  return (
    <>
      <main className="flex flex-col items-center justify-start h-screen bg-gray-900 p-8 mt-20">
        <h2 className="text-sm text-gray-400 mb-0 text-left w-full mt-2 fade-in">2024-2025</h2>
        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-800 leading-tight pt-0 mb-2 text-left w-full slide-in">
          Design Challenges
        </h1>

        {/* Arrow Icon */}
        <div className="mt-4 bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 6l-6 6 6 6M18 12H3" />
          </svg>
        </div>

        {/* Challenge Section */}
        <div className="mt-10 flex flex-col bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-4xl fade-in">
          <div className="flex items-start">
            <div className="mr-4">
              <p className="text-sm text-gray-400 mb-1">
                The <span className="text-white text-lg font-semibold">ATLAS</span>
              </p>
              <img
                src="/images/download.webp" // Update this to your correct path
                alt="A representation of the design challenge"
                className="w-48 h-auto rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Challenge Title</h3>
              <p className="text-white mt-2">Description of the challenge goes here, detailing what participants can expect.</p>
              <button
                onClick={handleToggle}
                aria-expanded={showMore}
                className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
                style={{ transition: 'transform 0.3s ease-in-out' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {showMore ? 'Show Less' : 'See More'}
              </button>
            </div>
          </div>

          {/* Expanded content section */}
          <div
            className={`mt-5 bg-gray-700 p-6 rounded-md w-full transition-all duration-500 ease-in-out ${showMore ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
          >
            <img
              src="/images/download.webp" // Ensure the image path is correct
              alt="An additional view related to the challenge"
              className="w-full h-[400px] rounded-md object-cover mb-4" // Full width, fixed height, maintain aspect ratio
            />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Team</p>
                <h4 className="text-2xl font-semibold text-white">Team Name</h4>
              </div>
              <p className="text-gray-400">| Apply Today</p>
            </div>
            <h4 className="text-lg font-semibold text-white mt-4">Additional Information</h4>
            <p className="text-white">Further details about the challenge can be included here.</p>
            <div className="flex justify-around mt-6">
              <a href="https://blueskies.nianet.org/competition/" target="_blank" rel="noopener noreferrer">
                <img src="/images/blue.png" alt="Blue Skies Competition" className="w-40 h-20 rounded-lg" />
              </a>
              <a href="https://www.herox.com/SolarDistrictCup" target="_blank" rel="noopener noreferrer">
                <img src="/images/solar.png" alt="Solar District Cup" className="w-40 h-20 rounded-lg" />
              </a>
              <a href="https://rascal.nianet.org/" target="_blank" rel="noopener noreferrer">
                <img src="/images/other.png" alt="RASC-AL" className="w-40 h-20 rounded-lg" />
              </a>
              <a href="https://www.aiaa.org/get-involved/students-educators/Design-Competitions" target="_blank" rel="noopener noreferrer">
                <img src="/images/aiaa.png" alt="AIAA Design Competitions" className="w-40 h-20 rounded-lg" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DesignChallenges;
