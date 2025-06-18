import React from "react";

interface Chunk {
  code: string;
  image: HTMLCanvasElement | null;
}

interface ChunkOverviewProps {
  chunks: Chunk[];
  currentIndex: number;
  onChunkSelect: (index: number) => void;
}

export const ChunkOverview: React.FC<ChunkOverviewProps> = ({
  chunks,
  currentIndex,
  onChunkSelect,
}) => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">All Chunks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {chunks.map((chunk, index) => (
          <div
            key={index}
            onClick={() => onChunkSelect(index)}
            className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
              index === currentIndex
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Chunk {index + 1}
              </span>
              {chunk.image && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {chunk.code.trim() || "Empty chunk"}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {chunk.code.length} chars
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 