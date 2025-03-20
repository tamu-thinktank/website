"use client";

import React, { useState } from 'react';

const linksData = [
    { type: 'Officer', name: 'Officer Application', url: '/officer-apply', description: 'Officer application is now open.', status: 'open' },
    { type: 'MateROV', name: 'MateROV Application', url: '/materov-apply', description: 'MateROV application is now open.', status: 'open' },
    { type: 'Design Challenge Application', name: 'General Application', url: '#', description: 'General applications are currently closed.', status: 'closed' },
    { type: 'MiniDC', name: 'MiniDC Application', url: '/minidc-apply', description: 'MiniDC application coming soon.', status: 'soon' }
];

const LinkCollectionPage: React.FC = () => {
    const [selectedDescription, setSelectedDescription] = useState<string>('Hover over a link to see its description.');

    return (
        <div className="relative w-full p-8 pt-32 md:p-12 md:pl-24 md:pt-72 lg:p-16 lg:pl-32 lg:pt-40">
            <div className="flex flex-col items-start gap-0">
                <span className="font-dm-sans text-[0.93em] font-semibold text-[#B8B8B8] md:text-[0.93em]">
                    2025-2026
                </span>
                <h1 className="font-poppins bg-gradient-to-r from-white to-gray-500 bg-clip-text text-[3.9rem] font-semibold text-transparent md:text-[5.2rem] lg:text-[6.5rem]">
                    Application Hub
                </h1>
            </div>
            <svg
                className="absolute bottom-4 right-16 h-8 w-8 rotate-180 md:bottom-12 md:right-24 md:h-10 md:w-10 lg:bottom-16 lg:right-32 lg:h-12 lg:w-12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            <div className="grid md:grid-cols-2 gap-6 mt-16">
                {linksData.map((link, index) => (
                    <a
                        key={index}
                        href={link.status === 'closed' ? '#' : link.url}
                        onMouseEnter={() => setSelectedDescription(link.description)}
                        onMouseLeave={() => setSelectedDescription('Hover over a link to see its description.')}
                        className={`block p-6 rounded-2xl shadow-md transition-transform transform hover:scale-105 text-white ${link.status === 'closed' ? 'bg-gray-400 cursor-not-allowed' : link.status === 'soon' ? 'bg-yellow-500' : link.type === 'Officer' ? 'bg-blue-500' : 'bg-green-500'}`}
                    >
                        <h2 className="text-xl font-semibold">{link.name}</h2>
                        <p className="text-sm">{link.description}</p>
                    </a>
                ))}
            </div>

            <div className="mt-8 p-4 bg-white shadow rounded-xl">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-gray-600">{selectedDescription}</p>
            </div>
        </div>
    );
};

export default LinkCollectionPage;
