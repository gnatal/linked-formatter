import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationProps {
  currentIndex: number;
  totalChunks: number;
  onNavigate: (direction: "prev" | "next") => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentIndex,
  totalChunks,
  onNavigate,
}) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onNavigate("prev")}
        disabled={currentIndex === 0}
        className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
        Previous
      </button>

      <span className="text-gray-700 font-medium">
        Chunk {currentIndex + 1} of {totalChunks}
      </span>

      <button
        onClick={() => onNavigate("next")}
        disabled={currentIndex === totalChunks - 1}
        className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight size={20} />
      </button>
    </div>
  );
}; 