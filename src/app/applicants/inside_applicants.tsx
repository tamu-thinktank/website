'use client';

import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const GraySection = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [notes, setNotes] = useState("");

    // New states for interview details
    const [interviewer, setInterviewer] = useState("");
    const [interviewTime, setInterviewTime] = useState("");
    const [interviewRoom, setInterviewRoom] = useState("");

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

    useEffect(() => {
        setInterviewer(localStorage.getItem("interviewer") || "");
        setInterviewTime(localStorage.getItem("interviewTime") || "");
        setInterviewRoom(localStorage.getItem("interviewRoom") || "");
    }, []);

    useEffect(() => {
        localStorage.setItem("interviewer", interviewer);
    }, [interviewer]);

    useEffect(() => {
        localStorage.setItem("interviewTime", interviewTime);
    }, [interviewTime]);

    useEffect(() => {
        localStorage.setItem("interviewRoom", interviewRoom);
    }, [interviewRoom]);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const toggleSecondDropdown = () => {
        setIsSecondDropdownOpen(prev => !prev);
    };

    // Condition to check if buttons should be displayed
    const isFormComplete = interviewer.trim() && interviewTime.trim() && interviewRoom.trim();

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

            {/* Second Horizontal Dropdown */}
            <div className="mt-4 flex flex-col items-center space-y-2">
                <button
                    onClick={toggleSecondDropdown}
                    className="mt-2 bg-gray-500 text-white py-2 px-4 rounded-lg text-center"
                >
                    Interview Details
                </button>

                {isSecondDropdownOpen && (
                    <div className="w-full flex flex-col space-y-2">
                        <input
                            type="text"
                            placeholder="Interviewer Name"
                            className="p-2 w-full rounded-lg bg-gray-300 text-black text-center"
                            value={interviewer}
                            onChange={(e) => setInterviewer(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Interview Time"
                            className="p-2 w-full rounded-lg bg-gray-300 text-black text-center"
                            value={interviewTime}
                            onChange={(e) => setInterviewTime(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Interview Room"
                            className="p-2 w-full rounded-lg bg-gray-300 text-black text-center"
                            value={interviewRoom}
                            onChange={(e) => setInterviewRoom(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Interview & Reject Buttons (Only show if all fields are filled) */}
            {isFormComplete && (
                <div className="mt-4 flex justify-center gap-4">
                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        Interview
                    </button>
                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Reject
                    </button>
                </div>
            )}

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
                        <h3 className="text-lg font-semibold">
                            {selectedOption === "interview" ? "Interview Notes" : "Application Notes"}
                        </h3>
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
