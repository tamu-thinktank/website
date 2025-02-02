'use client';

import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Star, Lock } from "lucide-react";

const GraySection = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const toggleSecondDropdown = () => {
        setIsSecondDropdownOpen(prev => !prev);
    };

    return (
        <section className="p-4 rounded-xl shadow-md w-[1000px] h-[960px] mx-auto mt-40" style={{ backgroundColor: '#2A2A2A' }}>
            <div className="flex justify-center items-center mb-4 relative">
                <div className="text-white font-semibold text-center">
                    <span className="mr-4">Interviewee Name</span> |
                    <span className="mx-4">UIN</span> |
                    <span className="ml-4">Submission Date</span>
                </div>
                <div className="absolute right-0 w-32 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white font-semibold">
                    Status
                </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 text-center">Gray Section</h2>

            {/* Smaller lighter gray box */}
            <div className="mt-0 p-4 h-80 rounded-lg bg-gray-400 text-center">
                <p className="text-white">This is a smaller gray box with a lighter background.</p>
            </div>

            {/* Notes Dropdown */}
            <div className="mt-4">
                <Select onValueChange={setSelectedOption}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="interview">Interview Notes</SelectItem>
                        <SelectItem value="application">Application Notes</SelectItem>
                    </SelectContent>
                </Select>
                {selectedOption && (
                    <div className="w-full h-80 mt-4 p-4 bg-gray-500 rounded-lg text-white text-center">
                        {selectedOption === "interview" ? "Interview Notes Section" : "Application Notes Section"}
                    </div>
                )}
            </div>

            {/* Star Rating System with Lock */}
            <div className="mt-8 flex justify-center items-center gap-4">
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-10 h-10 cursor-pointer transition-colors duration-300 ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-500"
                                }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        />
                    ))}
                </div>
                <Lock
                    className={`w-10 h-10 cursor-pointer transition-colors duration-300 ${isLocked ? "text-red-500" : "text-gray-500"
                        }`}
                    onClick={() => setIsLocked(prev => !prev)}
                />
            </div>

            {/* Lock and Reject Buttons */}
            <div className="mt-4 flex justify-center gap-4">
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Lock</button>
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Reject</button>
            </div>
        </section>
    );
};

export default GraySection;
