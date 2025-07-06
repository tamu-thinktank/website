"use client";

import React from "react";
import { ApplicantDetailsModal } from "./ApplicantDetailsModal";
import type { ApplicationStatus } from "@prisma/client";

interface ApplicantRowProps {
  applicant: {
    id: string;
    name: string;
    status?: ApplicationStatus;
    interests?: string[];
    teamRankings?: string[];
    major?: string;
    year?: string;
    rating?: string;
    category?: string;
  };
  isLocked?: boolean;
  onToggleLock?: (id: string) => void;
  showStatus?: boolean;
}

// Define a type for the API response
interface ApplicantResponse {
  id: string;
  status: ApplicationStatus;
  // Add other fields if needed
}

export const ApplicantRow: React.FC<ApplicantRowProps> = ({
  applicant,
  isLocked,
  onToggleLock,
  showStatus = false,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const getStatusColor = (status?: ApplicationStatus) => {
    switch (status) {
      case "PENDING":
        return "text-orange-400";
      case "INTERVIEWING":
        return "text-blue-400";
      case "ACCEPTED":
        return "text-green-400";
      case "REJECTED":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  // Fetch the current status if not already available
  const [currentStatus, setCurrentStatus] = React.useState<
    ApplicationStatus | undefined
  >(applicant.status);

  React.useEffect(() => {
    if (!applicant.status && applicant.id) {
      const fetchStatus = async () => {
        try {
          const response = await fetch(`/api/applicant/${applicant.id}`);
          if (response.ok) {
            const data = (await response.json()) as ApplicantResponse;
            setCurrentStatus(data.status ?? undefined);
          }
        } catch (error) {
          console.error("Failed to fetch applicant status:", error);
        }
      };

      // Use void to explicitly mark the promise as ignored
      void fetchStatus();
    } else {
      setCurrentStatus(applicant.status);
    }
  }, [applicant.id, applicant.status]);

  return (
    <>
      <div className="flex w-full items-center justify-center gap-10 px-5 py-4 text-sm transition-colors hover:bg-neutral-800">
        <div
          className="flex-1 cursor-pointer text-center hover:text-blue-400 hover:underline"
          onClick={() => setIsModalOpen(true)}
        >
          {applicant.name}
        </div>
        <div className="flex-1 text-center">
          {applicant.interests?.join(", ") ?? "N/A"}
        </div>
        <div className="flex-1 text-center">
          {applicant.teamRankings?.join(", ") ?? "N/A"}
        </div>
        <div className="flex-1 text-center">{applicant.major ?? "N/A"}</div>
        <div className="flex-1 text-center">{applicant.year ?? "N/A"}</div>

        {showStatus ? (
          <div
            className={`flex-1 text-center ${getStatusColor(currentStatus)}`}
          >
            {currentStatus ?? "PENDING"}
          </div>
        ) : onToggleLock ? (
          <div className="flex-1 text-center">
            <button
              onClick={() => onToggleLock(applicant.id)}
              className="h-5 w-5 cursor-pointer"
            >
              {isLocked ? (
                <span className="text-green-400">🔒</span>
              ) : (
                <span className="text-red-600">🔓</span>
              )}
            </button>
          </div>
        ) : null}
      </div>

      <ApplicantDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applicantId={applicant.id}
      />
    </>
  );
};
