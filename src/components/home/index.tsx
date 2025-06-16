"use client";
import React, { useState, useEffect } from 'react';
import { PlusCircle, Download, Palette, Type, Image } from 'lucide-react';

interface Slide {
  id: string;
  content: string;
  order: number;
  characterCount: number;
}

interface StyleOptions {
  template: 'professional' | 'creative' | 'minimal';
  colorScheme: 'linkedin' | 'dark' | 'colorful';
  fontSize: 'small' | 'medium' | 'large';
}

export default function LinkedInCarouselGenerator() {
  const [inputText, setInputText] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [styleOptions, setStyleOptions] = useState<StyleOptions>({
    template: 'professional',
    colorScheme: 'linkedin',
    fontSize: 'medium'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isZipLibLoaded, setIsZipLibLoaded] = useState(false);

  // Load JSZip library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = () => setIsZipLibLoaded(true);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGenerateSlides = () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    
    // Enhanced text splitting algorithm with line break detection
    const paragraphs = inputText.split(/\n\s*\n|\n/).filter(p => p.trim().length > 0);
    const wordsPerSlide = 25; // Optimal for LinkedIn readability
    const newSlides: Slide[] = [];
    let slideCounter = 0;
    
    paragraphs.forEach((paragraph) => {
      const trimmedParagraph = paragraph.trim();
      if (!trimmedParagraph) return;
      
      // Check if the paragraph is short enough to be a single slide
      const words = trimmedParagraph.split(' ');
      if (words.length <= wordsPerSlide) {
        // Add as a single slide
        newSlides.push({
          id: `slide-${slideCounter++}`,
          content: trimmedParagraph,
          order: slideCounter,
          characterCount: trimmedParagraph.length
        });
      } else {
        // Split longer paragraphs by sentences
        const sentences = trimmedParagraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
        let currentSlideText = '';
        
        sentences.forEach((sentence) => {
          const sentenceWords = sentence.trim().split(' ');
          
          if (currentSlideText.split(' ').length + sentenceWords.length > wordsPerSlide && currentSlideText.length > 0) {
            // Create a new slide with current content
            newSlides.push({
              id: `slide-${slideCounter++}`,
              content: currentSlideText.trim(),
              order: slideCounter,
              characterCount: currentSlideText.trim().length
            });
            currentSlideText = sentence.trim();
          } else {
            currentSlideText += (currentSlideText ? '. ' : '') + sentence.trim();
          }
        });
        
        // Add the remaining content as a slide
        if (currentSlideText.trim()) {
          newSlides.push({
            id: `slide-${slideCounter++}`,
            content: currentSlideText.trim(),
            order: slideCounter,
            characterCount: currentSlideText.trim().length
          });
        }
      }
    });
    
    // Update order numbers to be sequential
    newSlides.forEach((slide, index) => {
      slide.order = index + 1;
    });
    
    setSlides(newSlides);
    setCurrentSlide(0);
    setIsGenerating(false);
  };

  const getTemplateStyles = () => {
    const baseStyles = "w-full h-96 p-8 rounded-lg shadow-lg flex items-center justify-center text-center transition-all duration-300";
    
    switch (styleOptions.template) {
      case 'professional':
        return `${baseStyles} bg-gradient-to-br from-blue-600 to-blue-800 text-white`;
      case 'creative':
        return `${baseStyles} bg-gradient-to-br from-purple-500 to-pink-500 text-white`;
      case 'minimal':
        return `${baseStyles} bg-white border-2 border-gray-200 text-gray-800`;
      default:
        return `${baseStyles} bg-gradient-to-br from-blue-600 to-blue-800 text-white`;
    }
  };

  const getFontSize = () => {
    switch (styleOptions.fontSize) {
      case 'small': return 'text-sm';
      case 'medium': return 'text-lg';
      case 'large': return 'text-xl';
      default: return 'text-lg';
    }
  };

  const downloadSlide = (slideIndex: number) => {
    const slide = slides[slideIndex];
    if (!slide) return;

    // Create a canvas to generate the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions (LinkedIn optimal: 1080x1080)
    canvas.width = 1080;
    canvas.height = 1080;

    // Set background based on template
    let bgColor = '#1976d2'; // Professional blue
    if (styleOptions.template === 'creative') bgColor = '#9c27b0'; // Purple
    if (styleOptions.template === 'minimal') bgColor = '#ffffff'; // White

    // Fill background
    if (styleOptions.template === 'minimal') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    } else {
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (styleOptions.template === 'professional') {
        gradient.addColorStop(0, '#1976d2');
        gradient.addColorStop(1, '#1565c0');
      } else {
        gradient.addColorStop(0, '#9c27b0');
        gradient.addColorStop(1, '#e91e63');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Set text properties
    const fontSize = styleOptions.fontSize === 'small' ? 32 : styleOptions.fontSize === 'large' ? 48 : 40;
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = styleOptions.template === 'minimal' ? '#333333' : '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Wrap text
    const words = slide.content.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = canvas.width - 160; // 80px margin on each side

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
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
    ctx.font = '24px Arial, sans-serif';
    ctx.fillStyle = styleOptions.template === 'minimal' ? '#666666' : 'rgba(255,255,255,0.7)';
    ctx.fillText(`${slideIndex + 1} / ${slides.length}`, canvas.width / 2, canvas.height - 40);

    // Download the image
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linkedin-carousel-slide-${slideIndex + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const downloadAllSlides = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zip = new (window as any).JSZip();
    
    // Generate all slide images and add them to the zip
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (!slide) continue;

      // Create canvas for this slide
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      // Set canvas dimensions (LinkedIn optimal: 1080x1080)
      canvas.width = 1080;
      canvas.height = 1080;

      // Set background based on template
      let bgColor = '#1976d2'; // Professional blue
      if (styleOptions.template === 'creative') bgColor = '#9c27b0'; // Purple
      if (styleOptions.template === 'minimal') bgColor = '#ffffff'; // White

      // Fill background
      if (styleOptions.template === 'minimal') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      } else {
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        if (styleOptions.template === 'professional') {
          gradient.addColorStop(0, '#1976d2');
          gradient.addColorStop(1, '#1565c0');
        } else {
          gradient.addColorStop(0, '#9c27b0');
          gradient.addColorStop(1, '#e91e63');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Set text properties
      const fontSize = styleOptions.fontSize === 'small' ? 32 : styleOptions.fontSize === 'large' ? 48 : 40;
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = styleOptions.template === 'minimal' ? '#333333' : '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Wrap text
      const words = slide.content.split(' ');
      const lines = [];
      let currentLine = '';
      const maxWidth = canvas.width - 160; // 80px margin on each side

      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine !== '') {
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
      ctx.font = '24px Arial, sans-serif';
      ctx.fillStyle = styleOptions.template === 'minimal' ? '#666666' : 'rgba(255,255,255,0.7)';
      ctx.fillText(`${i + 1} / ${slides.length}`, canvas.width / 2, canvas.height - 40);

      // Convert canvas to blob and add to zip
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });

      // Add the image to the zip with a filename
      zip.file(`linkedin-carousel-slide-${String(i + 1).padStart(2, '0')}.png`, blob);
    }

    // Generate the zip file and trigger download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-carousel-${slides.length}-slides.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">LinkedIn Carousel Generator</h1>
            </div>
            <p className="text-gray-600">Transform your content into engaging carousel posts</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Panel - Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Content</h2>
                <span className="text-sm text-gray-500">{inputText.length} characters</span>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your long-form content here... I'll help you transform it into an engaging LinkedIn carousel that will capture your audience's attention and drive meaningful engagement."
                className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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

            {/* Style Options */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Style Options
              </h3>
              
              <div className="space-y-4">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['professional', 'creative', 'minimal'] as const).map((template) => (
                      <button
                        key={template}
                        onClick={() => setStyleOptions(prev => ({ ...prev, template }))}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          styleOptions.template === template
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-600'
                        }`}
                      >
                        {template.charAt(0).toUpperCase() + template.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <div className="flex space-x-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setStyleOptions(prev => ({ ...prev, fontSize: size }))}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-center ${
                          styleOptions.fontSize === size
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-600'
                        }`}
                      >
                        <Type className={`w-${size === 'small' ? '3' : size === 'medium' ? '4' : '5'} h-${size === 'small' ? '3' : size === 'medium' ? '4' : '5'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Carousel Preview</h2>
                {slides.length > 0 && (
                  <span className="text-sm text-gray-500">
                    Slide {currentSlide + 1} of {slides.length}
                  </span>
                )}
              </div>

              {/* Slide Preview */}
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
                      <p className="text-lg font-medium mb-2">No slides generated yet</p>
                      <p className="text-sm">{`Add your content and click "Generate Slides" to see the preview`}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
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
                          currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                    disabled={currentSlide === slides.length - 1}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Export Section */}
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
                        : 'Loading ZIP functionality...'}
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
                    <strong>LinkedIn Tip:</strong> {`Upload images in order to create your carousel post. Each slide is optimized at 1080x1080px for LinkedIn's requirements.`}
                  </p>
                </div>
                
                {slides.length > 0 && (
                  <div className="mt-3 text-xs text-gray-500">
                    Generated {slides.length} slides • Total characters: {slides.reduce((sum, slide) => sum + slide.characterCount, 0)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}