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
        seemore: 'src/app/challenges'
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

    const formatDescription = (description: string) => {
        return description.split('\n').map((line, index) => (
            <p key={index} className="text-sm text-white-600">{line}</p>
        ));
    };

    return (
        <div className="relative w-full p-4 sm:p-8 lg:p-12 pt-16 sm:pt-24 lg:pt-32">
            <div className="flex flex-col items-start gap-0">
                <span className="font-dm-sans text-[0.93em] font-semibold text-[#B8B8B8] md:text-[0.93em]">
                    2025-2026
                </span>
                <h1 className="font-poppins bg-gradient-to-r from-white to-gray-500 bg-clip-text text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] font-semibold text-transparent">
                    Application Hub
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
                {linksData.map((link, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-lg w-full"
                    >
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">{link.name}</h2>
                        <div className="mt-4">{formatDescription(link.description)}</div>

                        {link.status === 'open' && (
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <a
                                    href={link.url}
                                    className="w-full sm:w-auto text-center bg-white text-blue-600 py-2 px-4 rounded-md"
                                >
                                    Apply
                                </a>
                                <a
                                    href={link.seemore}
                                    className="w-full sm:w-auto text-center border-2 border-white text-white py-2 px-4 rounded-md"
                                >
                                    See More Info
                                </a>
                            </div>
                        )}

                        {link.status === 'closed' && (
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <button
                                    className="w-full sm:w-auto text-center bg-gray-400 text-gray-700 py-2 px-4 rounded-md cursor-not-allowed"
                                >
                                    Apply
                                </button>
                                <button
                                    className="w-full sm:w-auto text-center border-2 border-gray-400 text-gray-700 py-2 px-4 rounded-md cursor-not-allowed"
                                >
                                    See More Info
                                </button>
                            </div>
                        )}

                        {link.status === 'soon' && (
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <button
                                    className="w-full sm:w-auto text-center bg-yellow-500 text-white py-2 px-4 rounded-md cursor-not-allowed"
                                >
                                    Apply
                                </button>
                                <button
                                    className="w-full sm:w-auto text-center border-2 border-yellow-500 text-yellow-500 py-2 px-4 rounded-md cursor-not-allowed"
                                >
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
