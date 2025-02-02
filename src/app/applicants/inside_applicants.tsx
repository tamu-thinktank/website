'use client';

import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const GraySection = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (selectedOption) {
            setNotes(localStorage.getItem(`notes_${selectedOption}`) || "");
        }
    }, [selectedOption]);

    useEffect(() => {
        if (selectedOption) {
            localStorage.setItem(`notes_${selectedOption}`, notes);
        }
    }, [notes, selectedOption]);

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
                    <span className="mr-4">Student Name</span> |
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
                <Select onValueChange={(value) => { setSelectedOption(value); }}>
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
                        <h3 className="text-lg font-semibold">{selectedOption === "interview" ? "Interview Notes" : "Application Notes"}</h3>
                        <textarea
                            className="w-full h-64 mt-2 p-2 text-white rounded-lg"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Type your notes here..."
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default GraySection;
