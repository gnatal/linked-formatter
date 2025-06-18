import { useState, useRef, useCallback } from "react";
import JSZip from 'jszip';

interface ChunkCode {
  code: string;
  image: HTMLCanvasElement | null;
}

interface CanvasContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

interface RenderConfig {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  startY: number;
  leftPadding: number;
  lineNumberWidth: number;
}

interface Token {
  text: string;
  color: string;
}

interface SyntaxPattern {
  pattern: RegExp;
  color: string;
}

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
} as const;

const syntaxPatterns: readonly SyntaxPattern[] = [
  { pattern: /\/\/.*$/gm, color: colors.comment },
  { pattern: /\/\*[\s\S]*?\*\//gm, color: colors.comment },
  { pattern: /"([^"\\]|\\.)*"/g, color: colors.string },
  { pattern: /'([^'\\]|\\.)*'/g, color: colors.string },
  { pattern: /`([^`\\]|\\.)*`/g, color: colors.string },
  { pattern: /\b\d+\.?\d*\b/g, color: colors.number },
  { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|this|super|extends|implements|interface|type|enum|namespace|module|declare|public|private|protected|static|readonly|abstract)\b/g, color: colors.keyword },
  { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, color: colors.constant },
  { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, color: colors.type },
  { pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g, color: colors.function },
  { pattern: /\.[a-zA-Z_$][a-zA-Z0-9_$]*/g, color: colors.property },
  { pattern: /[{}[\]()]/g, color: colors.punctuation },
  { pattern: /[+\-*/%=<>!&|^~?:;,]/g, color: colors.operator },
];

const renderConfig: RenderConfig = {
  fontSize: 16,
  fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
  lineHeight: 24,
  startY: 100,
  leftPadding: 80,
  lineNumberWidth: 60
};

const createCanvas = (): CanvasContext => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  
  return { canvas, ctx };
};

const drawBackground = (ctx: CanvasRenderingContext2D): void => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
  gradient.addColorStop(0, colors.background);
  gradient.addColorStop(1, colors.backgroundSecondary);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1080);
};

const drawHeaderBar = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = "#2d2d30";
  ctx.fillRect(0, 0, 1080, 60);
};

const drawWindowControls = (ctx: CanvasRenderingContext2D): void => {
  const controlColors = ["#ff5f57", "#ffbd2e", "#28ca42"] as const;
  
  controlColors.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(30 + index * 25, 30, 8, 0, 2 * Math.PI);
    ctx.fill();
  });
};

const drawFileTab = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = colors.background;
  ctx.fillRect(120, 0, 200, 60);
  ctx.fillStyle = colors.foreground;
  ctx.font = "14px 'Segoe UI', system-ui, sans-serif";
  ctx.fillText("code.js", 140, 35);
};

const drawLineNumbersBackground = (ctx: CanvasRenderingContext2D, config: RenderConfig): void => {
  ctx.fillStyle = "#252526";
  ctx.fillRect(0, 60, config.lineNumberWidth, 1020);
};

const drawSeparatorLine = (ctx: CanvasRenderingContext2D, config: RenderConfig): void => {
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(config.lineNumberWidth, 60);
  ctx.lineTo(config.lineNumberWidth, 1080);
  ctx.stroke();
};

const applySyntaxHighlighting = (line: string): readonly Token[] => {
  let tokens: Token[] = [{ text: line, color: colors.foreground }];

  syntaxPatterns.forEach(({ pattern, color }) => {
    const newTokens: Token[] = [];
    
    tokens.forEach(token => {
      if (token.color !== colors.foreground) {
        newTokens.push(token);
        return;
      }

      let lastIndex = 0;
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      
      while ((match = regex.exec(token.text)) !== null) {
        if (match.index > lastIndex) {
          newTokens.push({
            text: token.text.substring(lastIndex, match.index),
            color: colors.foreground
          });
        }
        
        newTokens.push({
          text: match[0],
          color: color
        });
        
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < token.text.length) {
        newTokens.push({
          text: token.text.substring(lastIndex),
          color: colors.foreground
        });
      }
    });
    
    tokens = newTokens.filter(token => token.text.length > 0);
  });

  return tokens;
};

const drawLineNumber = (ctx: CanvasRenderingContext2D, lineIndex: number, y: number, config: RenderConfig): void => {
  ctx.fillStyle = colors.lineNumber;
  ctx.font = `${config.fontSize}px ${config.fontFamily}`;
  ctx.textAlign = "right";
  ctx.fillText((lineIndex + 1).toString(), config.lineNumberWidth - 10, y);
};

const drawCodeLine = (ctx: CanvasRenderingContext2D, line: string, y: number, config: RenderConfig): void => {
  if (!line.trim()) return;

  const tokens = applySyntaxHighlighting(line);
  let x = config.leftPadding;
  ctx.font = `${config.fontSize}px ${config.fontFamily}`;
  ctx.textAlign = "left";
  
  tokens.forEach(token => {
    ctx.fillStyle = token.color;
    ctx.fillText(token.text, x, y);
    x += ctx.measureText(token.text).width;
  });
};

const drawCodeLines = (ctx: CanvasRenderingContext2D, lines: readonly string[], config: RenderConfig): void => {
  lines.forEach((line, lineIndex) => {
    const y = config.startY + lineIndex * config.lineHeight;
    
    if (y > 1050) return;

    drawLineNumber(ctx, lineIndex, y, config);
    drawCodeLine(ctx, line, y, config);
  });
};

const drawBorder = (ctx: CanvasRenderingContext2D): void => {
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 80, 1040, 980);
};

const drawCornerAccent = (ctx: CanvasRenderingContext2D): void => {
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
};

const drawBottomBar = (ctx: CanvasRenderingContext2D, lines: readonly string[], code: string): void => {
  ctx.fillStyle = "#007acc";
  ctx.fillRect(0, 1040, 1080, 40);
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px 'Segoe UI', system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Generated with VS Code Style", 20, 1065);
  
  ctx.textAlign = "right";
  ctx.fillText(`${lines.length} lines • ${code.length} characters`, 1060, 1065);
};

const renderCanvas = (ctx: CanvasRenderingContext2D, code: string): void => {
  const lines = code.split("\n");
  
  drawBackground(ctx);
  drawHeaderBar(ctx);
  drawWindowControls(ctx);
  drawFileTab(ctx);
  drawLineNumbersBackground(ctx, renderConfig);
  drawSeparatorLine(ctx, renderConfig);
  drawCodeLines(ctx, lines, renderConfig);
  drawBorder(ctx);
  drawCornerAccent(ctx);
  drawBottomBar(ctx, lines, code);
};

const html2canvas = (element: HTMLElement): Promise<HTMLCanvasElement> => {
  return new Promise((resolve) => {
    try {
      const { canvas, ctx } = createCanvas();
      const code = element.textContent || "";
      
      renderCanvas(ctx, code);
      
      setTimeout(() => resolve(canvas), 100);
    } catch (error) {
      console.error("Error in html2canvas:", error);
      const fallbackCanvas = document.createElement("canvas");
      fallbackCanvas.width = 1080;
      fallbackCanvas.height = 1080;
      resolve(fallbackCanvas);
    }
  });
};

export const useCodeToImage = () => {
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

  const setCurrentIndexHandler = (index: number) => {
    setCurrentIndex(index);
  };

  return {
    chunks,
    currentIndex,
    currentChunk,
    isGenerating,
    previewRef,
    updateCurrentChunk,
    addChunk,
    removeChunk,
    navigateChunk,
    downloadAll,
    downloadCurrent,
    setCurrentIndex: setCurrentIndexHandler,
  };
}; 