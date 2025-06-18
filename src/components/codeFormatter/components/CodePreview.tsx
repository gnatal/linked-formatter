import React from "react";
import { Download } from "lucide-react";

interface CodePreviewProps {
  image: HTMLCanvasElement | null;
  isGenerating: boolean;
  hasCode: boolean;
  onDownload: () => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
  code: string;
  currentIndex: number;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  image,
  isGenerating,
  hasCode,
  onDownload,
  previewRef,
  code,
  currentIndex,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Preview (1080x1080)
        </h2>
        <div className="flex gap-2">
          {isGenerating && (
            <span className="text-sm text-blue-600">Generating...</span>
          )}
          {image && (
            <button
              onClick={onDownload}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
            >
              <Download size={16} />
              Download
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <div
            ref={previewRef}
            className="absolute -top-full left-0 w-full h-full opacity-0 pointer-events-none"
            style={{ width: "1080px", height: "1080px" }}
          >
            <pre className="text-sm text-gray-100 p-4 font-mono whitespace-pre-wrap break-words">
              {code}
            </pre>
          </div>

          <div className="w-80 h-80 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-900">
            {image ? (
              <img
                src={image.toDataURL()}
                alt={`Code preview ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {hasCode ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Generating preview...</p>
                  </div>
                ) : (
                  <p>Enter code to see preview</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 