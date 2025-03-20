"use client";

import React, { useState } from 'react';

const linksData = [
    {
        type: 'Officer',
        name: 'Officer Application',
        url: '/officer-apply',
        description: '• Officer team dedicated to helping members learn, grow, and become passionate about engineering for the real world.\n• Alumni preferred.',
        status: 'open',
        seemore: 'about'
    },
    {
        type: 'MateROV',
        name: 'MateROV Application',
        url: '/materov-apply',
        description: '• Underwater robotics team where members design and build an autonomous rover for the MATE ROV competition.\n• Sophomores/Juniors preferred.',
        status: 'open',
        seemore: '/MATE'
    },
    {
        type: 'General',
        name: 'Design Application',
        url: '#',
        description: '• Engineering capstone projects where members learn to design systems for real-world problems.\n• Freshmen/Sophomores preferred.',
        status: 'closed',
        seemore: 'src\app\challenges'
    },
    {
        type: 'MiniDC',
        name: 'MiniDC Application',
        url: '/minidc-apply',
        description: '• Shorter, hands-on engineering projects curated by ThinkTank to teach basic engineering principles.\n• Open to everyone.',
        status: 'soon',
        seemore: '/MATE'
    }
];

const LinkCollectionPage: React.FC = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // Helper function to split description into bullet points
    const formatDescription = (description: string) => {
        return description.split('\n').map((line, index) => (
            <p key={index} className="text-sm text-white-600">{line}</p>
        ));
    };

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-16">
                {linksData.map((link, index) => (
                    <div key={index} className="relative flex flex-col items-start justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-semibold text-white">{link.name}</h2>
                        {/* Add a gap between the title and description */}
                        <div className="mt-4">
                            {formatDescription(link.description)}
                        </div>

                        {/* Apply Button */}
                        {link.status === 'open' && (
                            <div className="mt-6 flex gap-4">
                                <a href={link.url} className="inline-block bg-white text-blue-500 py-2 px-6 rounded-lg">
                                    Apply
                                </a>
                                <a href={link.seemore} className="inline-block border-2 border-white text-white py-2 px-6 rounded-lg">
                                    See More Info
                                </a>
                            </div>
                        )}

                        {/* Disabled Button (Closed) */}
                        {link.status === 'closed' && (
                            <div className="mt-6 flex gap-4">
                                <button className="inline-block bg-gray-400 text-gray-700 py-2 px-6 rounded-lg cursor-not-allowed">
                                    Apply
                                </button>
                                <button className="inline-block border-2 border-gray-400 text-gray-700 py-2 px-6 rounded-lg cursor-not-allowed">
                                    See More Info
                                </button>
                            </div>
                        )}

                        {/* Soon Button */}
                        {link.status === 'soon' && (
                            <div className="mt-6 flex gap-4">
                                <button className="inline-block bg-yellow-500 text-white py-2 px-6 rounded-lg cursor-not-allowed">
                                    Apply
                                </button>
                                <button className="inline-block border-2 border-yellow-500 text-yellow-500 py-2 px-6 rounded-lg cursor-not-allowed">
                                    See More Info
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LinkCollectionPage;
