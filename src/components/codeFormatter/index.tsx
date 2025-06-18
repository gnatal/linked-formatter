"use client";
import React, { useState, useRef, useCallback } from "react";
import {
  Download,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import JSZip from 'jszip';

const html2canvas = (element: HTMLElement): Promise<HTMLCanvasElement> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      resolve(canvas);
      return;
    }

    // VS Code Dark Theme Colors
    const colors = {
      background: "#1e1e1e",
      backgroundSecondary: "#252526",
      foreground: "#d4d4d4",
      comment: "#6a9955",
      string: "#ce9178",
      number: "#b5cea8",
      keyword: "#569cd6",
      function: "#dcdcaa",
      variable: "#9cdcfe",
      operator: "#d4d4d4",
      punctuation: "#d4d4d4",
      type: "#4ec9b0",
      property: "#92c5f7",
      constant: "#4fc1ff",
      border: "#3e3e42",
      lineNumber: "#858585"
    };

    // Create VS Code-style gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
    gradient.addColorStop(0, colors.background);
    gradient.addColorStop(1, colors.backgroundSecondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Add header bar (like VS Code tab bar)
    ctx.fillStyle = "#2d2d30";
    ctx.fillRect(0, 0, 1080, 60);
    
    // Add fake window controls
    const controlColors = ["#ff5f57", "#ffbd2e", "#28ca42"];
    controlColors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(30 + index * 25, 30, 8, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Add fake file tab
    ctx.fillStyle = colors.background;
    ctx.fillRect(120, 0, 200, 60);
    ctx.fillStyle = colors.foreground;
    ctx.font = "14px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("code.js", 140, 35);

    // Simple syntax highlighting patterns
    const syntaxPatterns = [
      { pattern: /\/\/.*$/gm, color: colors.comment }, // Comments
      { pattern: /\/\*[\s\S]*?\*\//gm, color: colors.comment }, // Block comments
      { pattern: /"([^"\\]|\\.)*"/g, color: colors.string }, // Double quoted strings
      { pattern: /'([^'\\]|\\.)*'/g, color: colors.string }, // Single quoted strings
      { pattern: /`([^`\\]|\\.)*`/g, color: colors.string }, // Template literals
      { pattern: /\b\d+\.?\d*\b/g, color: colors.number }, // Numbers
      { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|this|super|extends|implements|interface|type|enum|namespace|module|declare|public|private|protected|static|readonly|abstract)\b/g, color: colors.keyword }, // Keywords
      { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, color: colors.constant }, // Constants
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, color: colors.type }, // Types/Classes
      { pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g, color: colors.function }, // Functions
      { pattern: /\.[a-zA-Z_$][a-zA-Z0-9_$]*/g, color: colors.property }, // Properties
      { pattern: /[{}[\]()]/g, color: colors.punctuation }, // Brackets
      { pattern: /[+\-*/%=<>!&|^~?:;,]/g, color: colors.operator }, // Operators
    ];

    const code = element.textContent || "";
    const lines = code.split("\n");
    
    // Font settings
    const fontSize = 16;
    const fontFamily = '"Fira Code", "Consolas", "Monaco", monospace';
    const lineHeight = 24;
    const startY = 100;
    const leftPadding = 80;
    const lineNumberWidth = 60;

    // Draw line numbers background
    ctx.fillStyle = "#252526";
    ctx.fillRect(0, 60, lineNumberWidth, 1020);
    
    // Draw separator line
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lineNumberWidth, 60);
    ctx.lineTo(lineNumberWidth, 1080);
    ctx.stroke();

    lines.forEach((line, lineIndex) => {
      const y = startY + lineIndex * lineHeight;
      
      if (y > 1050) return; // Don't overflow

      // Draw line number
      ctx.fillStyle = colors.lineNumber;
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = "right";
      ctx.fillText((lineIndex + 1).toString(), lineNumberWidth - 10, y);

      // Reset text alignment for code
      ctx.textAlign = "left";

      if (!line.trim()) return; // Skip empty lines

      // Create tokens with syntax highlighting
      let tokens = [{ text: line, color: colors.foreground }];

      // Apply syntax highlighting patterns
      syntaxPatterns.forEach(({ pattern, color }) => {
        const newTokens: Array<{ text: string; color: string }> = [];
        
        tokens.forEach(token => {
          if (token.color !== colors.foreground) {
            // Don't re-highlight already colored tokens
            newTokens.push(token);
            return;
          }

          let lastIndex = 0;
          let match;
          const regex = new RegExp(pattern.source, pattern.flags);
          
          while ((match = regex.exec(token.text)) !== null) {
            // Add text before match
            if (match.index > lastIndex) {
              newTokens.push({
                text: token.text.substring(lastIndex, match.index),
                color: colors.foreground
              });
            }
            
            // Add highlighted match
            newTokens.push({
              text: match[0],
              color: color
            });
            
            lastIndex = match.index + match[0].length;
          }
          
          // Add remaining text
          if (lastIndex < token.text.length) {
            newTokens.push({
              text: token.text.substring(lastIndex),
              color: colors.foreground
            });
          }
        });
        
        tokens = newTokens.filter(token => token.text.length > 0);
      });

      // Draw tokens
      let x = leftPadding;
      ctx.font = `${fontSize}px ${fontFamily}`;
      
      tokens.forEach(token => {
        ctx.fillStyle = token.color;
        ctx.fillText(token.text, x, y);
        x += ctx.measureText(token.text).width;
      });
    });

    // Add decorative border
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 80, 1040, 980);

    // Add subtle corner accent
    const accentGradient = ctx.createLinearGradient(1000, 100, 1060, 160);
    accentGradient.addColorStop(0, "rgba(86, 156, 214, 0.3)");
    accentGradient.addColorStop(1, "rgba(86, 156, 214, 0.1)");
    ctx.fillStyle = accentGradient;
    ctx.beginPath();
    ctx.moveTo(1000, 100);
    ctx.lineTo(1040, 100);
    ctx.lineTo(1040, 140);
    ctx.closePath();
    ctx.fill();

    // Add bottom branding/info bar
    ctx.fillStyle = "#007acc";
    ctx.fillRect(0, 1040, 1080, 40);
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Generated with VS Code Style", 20, 1065);
    
    ctx.textAlign = "right";
    ctx.fillText(`${lines.length} lines • ${code.length} characters`, 1060, 1065);

    setTimeout(() => resolve(canvas), 100);
  });
};

interface ChunkCode {
  code: string;
  image: HTMLCanvasElement | null;
}

const CodeToImageConverter: React.FC = () => {
  const [chunks, setChunks] = useState<ChunkCode[]>([
    { code: "", image: null },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const currentChunk = chunks[currentIndex];

  const updateCurrentChunk = useCallback(
    async (code: string) => {
      const newChunks = [...chunks];
      newChunks[currentIndex] = { ...newChunks[currentIndex], code };
      setChunks(newChunks);

      if (code.trim() && previewRef.current) {
        setIsGenerating(true);
        try {
          const canvas = await html2canvas(previewRef.current);
          newChunks[currentIndex] = {
            ...newChunks[currentIndex],
            image: canvas,
          };
          setChunks([...newChunks]);
        } catch (error) {
          console.error("Error generating image:", error);
        }
        setIsGenerating(false);
      }
    },
    [chunks, currentIndex]
  );

  const addChunk = () => {
    const newChunks = [...chunks, { code: "", image: null }];
    setChunks(newChunks);
    setCurrentIndex(newChunks.length - 1);
  };

  const removeChunk = () => {
    if (chunks.length > 1) {
      const newChunks = chunks.filter((_, index) => index !== currentIndex);
      setChunks(newChunks);
      setCurrentIndex(Math.min(currentIndex, newChunks.length - 1));
    }
  };

  const navigateChunk = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "next" && currentIndex < chunks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const downloadAll = async () => {

    const zip = new JSZip();
    let hasImages = false;

    chunks.forEach((chunk, index) => {
      if (chunk.image) {
        const dataUrl = chunk.image.toDataURL("image/png");
        const base64Data = dataUrl.split(",")[1];
        zip.file(`code-image-${index + 1}.png`, base64Data, { base64: true });
        hasImages = true;
      }
    });

    if (!hasImages) {
      alert("No images to download. Please generate some code images first.");
      return;
    }

    try {
      const blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "code-images.zip";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      alert("Error creating ZIP file. Please try again.");
    }
  };

  const downloadCurrent = () => {
    if (currentChunk.image) {
      const link = document.createElement("a");
      link.download = `code-image-${currentIndex + 1}.png`;
      link.href = currentChunk.image.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Code to Image Converter
          </h1>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={addChunk}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Chunk
            </button>

            <button
              onClick={removeChunk}
              disabled={chunks.length === 1}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Trash2 size={20} />
              Remove Chunk
            </button>

            <button
              onClick={downloadAll}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={20} />
              Download All
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateChunk("prev")}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <span className="text-gray-700 font-medium">
              Chunk {currentIndex + 1} of {chunks.length}
            </span>

            <button
              onClick={() => navigateChunk("next")}
              disabled={currentIndex === chunks.length - 1}
              className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Code Input
              </h2>
              <span className="text-sm text-gray-500">
                {currentChunk.code.length} characters
              </span>
            </div>

            <textarea
              value={currentChunk.code}
              onChange={(e) => updateCurrentChunk(e.target.value)}
              placeholder="Enter your code here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: '"Fira Code", "Consolas", monospace' }}
            />
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Preview (1080x1080)
              </h2>
              <div className="flex gap-2">
                {isGenerating && (
                  <span className="text-sm text-blue-600">Generating...</span>
                )}
                {currentChunk.image && (
                  <button
                    onClick={downloadCurrent}
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
                {/* Hidden element for html2canvas */}
                <div
                  ref={previewRef}
                  className="absolute -top-full left-0 w-full h-full opacity-0 pointer-events-none"
                  style={{ width: "1080px", height: "1080px" }}
                >
                  <pre className="text-sm text-gray-100 p-4 font-mono whitespace-pre-wrap break-words">
                    {currentChunk.code}
                  </pre>
                </div>

                {/* Visible preview */}
                <div className="w-80 h-80 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-900">
                  {currentChunk.image ? (
                    <img
                      src={currentChunk.image.toDataURL()}
                      alt={`Code preview ${currentIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {currentChunk.code.trim() ? (
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
        </div>

        {/* Chunk Overview */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            All Chunks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {chunks.map((chunk, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
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
      </div>
    </div>
  );
};

export default CodeToImageConverter;
