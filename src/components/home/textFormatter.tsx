import { PlusCircle, Palette, Type } from "lucide-react";
import { StyleOptions } from ".";

export const TextFormatter = ({
  inputText,
  setInputText,
  handleGenerateSlides,
  isGenerating,
  setStyleOptions,
  styleOptions,
}: {
  inputText: string;
  setInputText: (text: string) => void;
  handleGenerateSlides: () => void;
  isGenerating: boolean;
  setStyleOptions:  React.Dispatch<React.SetStateAction<StyleOptions>>;
  styleOptions: StyleOptions;
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Content</h2>
          <span className="text-sm text-gray-500">
            {inputText.length} characters
          </span>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your long-form content here... I'll help you transform it into an engaging LinkedIn carousel that will capture your audience's attention and drive meaningful engagement."
          className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
          maxLength={3000}
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400">Max 3,000 characters</span>
          <button
            onClick={handleGenerateSlides}
            disabled={!inputText.trim() || isGenerating}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Generate Slides</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Style Options
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["professional", "creative", "minimal"] as const).map(
                (template) => (
                  <button
                    key={template}
                    onClick={() =>
                      setStyleOptions((prev: StyleOptions) => ({ ...prev, template }))
                    }
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      styleOptions.template === template
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-600"
                    }`}
                  >
                    {template.charAt(0).toUpperCase() + template.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <div className="flex space-x-2">
              {(["small", "medium", "large"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setStyleOptions((prev) => ({
                      ...prev,
                      fontSize: size,
                    }))
                  }
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-center ${
                    styleOptions.fontSize === size
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-600"
                  }`}
                >
                  <Type
                    className={`w-${
                      size === "small" ? "3" : size === "medium" ? "4" : "5"
                    } h-${
                      size === "small" ? "3" : size === "medium" ? "4" : "5"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
