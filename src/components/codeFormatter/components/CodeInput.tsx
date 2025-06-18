import React from "react";

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  characterCount: number;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  code,
  onCodeChange,
  characterCount,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Code Input</h2>
        <span className="text-sm text-gray-500">{characterCount} characters</span>
      </div>

      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Enter your code here..."
        className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        style={{ fontFamily: '"Fira Code", "Consolas", monospace' }}
      />
    </div>
  );
}; 