import React from "react";
import { Download, Plus, Trash2 } from "lucide-react";

interface HeaderProps {
  onAddChunk: () => void;
  onRemoveChunk: () => void;
  onDownloadAll: () => void;
  canRemoveChunk: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onAddChunk,
  onRemoveChunk,
  onDownloadAll,
  canRemoveChunk,
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Code to Image Converter
      </h1>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onAddChunk}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Chunk
        </button>

        <button
          onClick={onRemoveChunk}
          disabled={!canRemoveChunk}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Trash2 size={20} />
          Remove Chunk
        </button>

        <button
          onClick={onDownloadAll}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={20} />
          Download All
        </button>
      </div>
    </div>
  );
}; 