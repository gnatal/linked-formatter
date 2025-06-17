import { Download, Image } from "lucide-react";
import { Slide, StyleOptions } from ".";

export const CarouselPreview = ({
  slides,
  currentSlide,
  setCurrentSlide,
  isZipLibLoaded,
  styleOptions,
}: {
  slides: Slide[];
  currentSlide: number;
  setCurrentSlide: (slideIndex: number) => void;
  isZipLibLoaded: boolean;
  styleOptions: StyleOptions;
}) => {
  const downloadAllSlides = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zip = new (window as any).JSZip();

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (!slide) continue;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      canvas.width = 1080;
      canvas.height = 1080;

      let bgColor = "#1976d2"; // Professional blue
      if (styleOptions.template === "creative") bgColor = "#9c27b0"; // Purple
      if (styleOptions.template === "minimal") bgColor = "#ffffff"; // White

      if (styleOptions.template === "minimal") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      } else {
        // Create gradient
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        if (styleOptions.template === "professional") {
          gradient.addColorStop(0, "#1976d2");
          gradient.addColorStop(1, "#1565c0");
        } else {
          gradient.addColorStop(0, "#9c27b0");
          gradient.addColorStop(1, "#e91e63");
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const fontSize =
        styleOptions.fontSize === "small"
          ? 32
          : styleOptions.fontSize === "large"
          ? 48
          : 40;
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.fillStyle =
        styleOptions.template === "minimal" ? "#333333" : "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const words = slide.content.split(" ");
      const lines = [];
      let currentLine = "";
      const maxWidth = canvas.width - 120; // 60px margin on each side

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine !== "") {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      const lineHeight = fontSize * 1.4;
      const totalHeight = lines.length * lineHeight;
      const startY = (canvas.height - totalHeight) / 2 + fontSize / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
      });

      ctx.font = "24px Arial, sans-serif";
      ctx.fillStyle =
        styleOptions.template === "minimal"
          ? "#666666"
          : "rgba(255,255,255,0.7)";
      ctx.fillText(
        `${i + 1} / ${slides.length}`,
        canvas.width / 2,
        canvas.height - 40
      );

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, "image/png");
      });

      zip.file(
        `linkedin-carousel-slide-${String(i + 1).padStart(2, "0")}.png`,
        blob
      );
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linkedin-carousel-${slides.length}-slides.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTemplateStyles = () => {
    const baseStyles =
      "w-full h-96 p-8 rounded-lg shadow-lg flex items-center justify-center text-center transition-all duration-300";

    switch (styleOptions.template) {
      case "professional":
        return `${baseStyles} bg-gradient-to-br from-blue-600 to-blue-800 text-white`;
      case "creative":
        return `${baseStyles} bg-gradient-to-br from-purple-500 to-pink-500 text-white`;
      case "minimal":
        return `${baseStyles} bg-white border-2 border-gray-200 text-gray-800`;
      default:
        return `${baseStyles} bg-gradient-to-br from-blue-600 to-blue-800 text-white`;
    }
  };

  const getFontSize = () => {
    switch (styleOptions.fontSize) {
      case "small":
        return "text-sm";
      case "medium":
        return "text-lg";
      case "large":
        return "text-xl";
      default:
        return "text-lg";
    }
  };

    const downloadSlide = (slideIndex: number) => {
    const slide = slides[slideIndex];
    if (!slide) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    // Set background based on template
    let bgColor = "#1976d2"; // Professional blue
    if (styleOptions.template === "creative") bgColor = "#9c27b0"; // Purple
    if (styleOptions.template === "minimal") bgColor = "#ffffff"; // White

    // Fill background
    if (styleOptions.template === "minimal") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    } else {
      // Create gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      if (styleOptions.template === "professional") {
        gradient.addColorStop(0, "#1976d2");
        gradient.addColorStop(1, "#1565c0");
      } else {
        gradient.addColorStop(0, "#9c27b0");
        gradient.addColorStop(1, "#e91e63");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Set text properties
    const fontSize =
      styleOptions.fontSize === "small"
        ? 32
        : styleOptions.fontSize === "large"
        ? 48
        : 40;
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = styleOptions.template === "minimal" ? "#333333" : "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Wrap text
    const words = slide.content.split(" ");
    const lines = [];
    let currentLine = "";
    const maxWidth = canvas.width - 160; // 80px margin on each side

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine !== "") {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    // Draw text lines
    const lineHeight = fontSize * 1.4;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2 + fontSize / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });

    // Add slide number
    ctx.font = "24px Arial, sans-serif";
    ctx.fillStyle =
      styleOptions.template === "minimal" ? "#666666" : "rgba(255,255,255,0.7)";
    ctx.fillText(
      `${slideIndex + 1} / ${slides.length}`,
      canvas.width / 2,
      canvas.height - 40
    );

    // Download the image
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `linkedin-carousel-slide-${slideIndex + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Carousel Preview
          </h2>
          {slides.length > 0 && (
            <span className="text-sm text-gray-500">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          )}
        </div>

        <div className="mb-6">
          {slides.length > 0 ? (
            <div className={getTemplateStyles()}>
              <div className="max-w-md">
                <p className={`${getFontSize()} leading-relaxed`}>
                  {slides[currentSlide]?.content}
                </p>
                <div className="mt-4 text-xs opacity-70">
                  {currentSlide + 1} / {slides.length}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  No slides generated yet
                </p>
                <p className="text-sm">{`Add your content and click "Generate Slides" to see the preview`}</p>
              </div>
            </div>
          )}
        </div>

        {slides.length > 0 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))
              }
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {slides.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export Options
          </h3>

          <div className="space-y-3">
            <button
              onClick={downloadAllSlides}
              disabled={!isZipLibLoaded}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>
                {isZipLibLoaded
                  ? `Download All Slides (ZIP - ${slides.length} images)`
                  : "Loading ZIP functionality..."}
              </span>
            </button>

            <button
              onClick={() => downloadSlide(currentSlide)}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Image className="w-4 h-4" />
              <span>Download Current Slide</span>
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>LinkedIn Tip:</strong>{" "}
              {`Upload images in order to create your carousel post. Each slide is optimized at 1080x1080px for LinkedIn's requirements.`}
            </p>
          </div>

          {slides.length > 0 && (
            <div className="mt-3 text-xs text-gray-500">
              Generated {slides.length} slides • Total characters:{" "}
              {slides.reduce(
                (sum: number, slide: Slide) => sum + slide.characterCount,
                0
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
