"use client";
import React, { useState } from 'react';
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

  const handleGenerateSlides = () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    
    // Simple text splitting algorithm (we'll enhance this later)
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordsPerSlide = 30;
    const newSlides: Slide[] = [];
    
    let currentSlideText = '';
    let slideCounter = 0;
    
    sentences.forEach((sentence) => {
      const words = sentence.trim().split(' ');
      
      if (currentSlideText.split(' ').length + words.length > wordsPerSlide && currentSlideText.length > 0) {
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
    
    // Add the last slide
    if (currentSlideText.trim()) {
      newSlides.push({
        id: `slide-${slideCounter}`,
        content: currentSlideText.trim(),
        order: slideCounter + 1,
        characterCount: currentSlideText.trim().length
      });
    }
    
    setSlides(newSlides);
    setCurrentSlide(0);
    setIsGenerating(false);
  };

  const getTemplateStyles = () => {
    const baseStyles = "w-full h-96 p-8 rounded-lg shadow-lg flex items-center justify-center text-center";
    
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-linkedin-blue rounded-lg flex items-center justify-center">
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
                className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-linkedin-blue focus:border-linkedin-blue transition-colors"
                maxLength={3000}
              />
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-400">Max 3,000 characters</span>
                <button
                  onClick={handleGenerateSlides}
                  disabled={!inputText.trim() || isGenerating}
                  className="px-6 py-2 bg-linkedin-blue text-white rounded-lg hover:bg-linkedin-lightblue disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
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
                            ? 'bg-linkedin-blue text-black border-linkedin-blue'
                            : 'bg-white text-black border-gray-200 hover:border-linkedin-blue'
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
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          styleOptions.fontSize === size
                            ? 'bg-linkedin-blue text-black border-linkedin-blue'
                            : 'bg-white text-black border-gray-200 hover:border-linkedin-blue'
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
                    <p className={`${getFontSize()} leading-relaxed max-w-md`}>
                      {slides[currentSlide]?.content}
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No slides generated yet</p>
                      <p className="text-sm">Add your content and click "Generate Slides" to see the preview</p>
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
                          currentSlide === index ? 'bg-linkedin-blue' : 'bg-gray-300'
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
                  <button className="w-full px-4 py-3 bg-linkedin-blue text-white rounded-lg hover:bg-linkedin-lightblue transition-colors flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download All Slides (ZIP)</span>
                  </button>
                  
                  <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <Image className="w-4 h-4" />
                    <span>Download Current Slide</span>
                  </button>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>LinkedIn Tip:</strong> Upload images in order to create your carousel post. Each slide will be optimized for LinkedIn's image requirements.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}