"use client";
import React, { useState, useEffect } from "react";
import { CarouselPreview } from "./carouselPreview";
import { TextFormatter } from "./textFormatter";

export interface Slide {
  id: string;
  content: string;
  order: number;
  characterCount: number;
}

export interface StyleOptions {
  template: "professional" | "creative" | "minimal";
  colorScheme: "linkedin" | "dark" | "colorful";
  fontSize: "small" | "medium" | "large";
}

export default function LinkedInCarouselGenerator() {
  const [inputText, setInputText] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [styleOptions, setStyleOptions] = useState<StyleOptions>({
    template: "professional",
    colorScheme: "linkedin",
    fontSize: "medium",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isZipLibLoaded, setIsZipLibLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = () => setIsZipLibLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGenerateSlides = () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);

    const paragraphs = inputText
      .split(/\n\s*\n|\n/)
      .filter((p) => p.trim().length > 0);
    const wordsPerSlide = 50;
    const newSlides: Slide[] = [];
    let slideCounter = 0;

    paragraphs.forEach((paragraph) => {
      const trimmedParagraph = paragraph.trim();
      if (!trimmedParagraph) return;

      const words = trimmedParagraph.split(" ");
      if (words.length <= wordsPerSlide) {
        newSlides.push({
          id: `slide-${slideCounter++}`,
          content: trimmedParagraph,
          order: slideCounter,
          characterCount: trimmedParagraph.length,
        });
      } else {
        const sentences = trimmedParagraph
          .split(/[.!?]+/)
          .filter((s) => s.trim().length > 0);
        let currentSlideText = "";

        sentences.forEach((sentence) => {
          const sentenceWords = sentence.trim().split(" ");

          if (
            currentSlideText.split(" ").length + sentenceWords.length >
              wordsPerSlide &&
            currentSlideText.length > 0
          ) {
            newSlides.push({
              id: `slide-${slideCounter++}`,
              content: currentSlideText.trim(),
              order: slideCounter,
              characterCount: currentSlideText.trim().length,
            });
            currentSlideText = sentence.trim();
          } else {
            currentSlideText +=
              (currentSlideText ? ". " : "") + sentence.trim();
          }
        });

        if (currentSlideText.trim()) {
          newSlides.push({
            id: `slide-${slideCounter++}`,
            content: currentSlideText.trim(),
            order: slideCounter,
            characterCount: currentSlideText.trim().length,
          });
        }
      }
    });

    newSlides.forEach((slide, index) => {
      slide.order = index + 1;
    });

    setSlides(newSlides);
    setCurrentSlide(0);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TextFormatter
            inputText={inputText}
            setInputText={setInputText}
            handleGenerateSlides={handleGenerateSlides}
            isGenerating={isGenerating}
            setStyleOptions={setStyleOptions}
            styleOptions={styleOptions}
          />
          <CarouselPreview
            slides={slides}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            isZipLibLoaded={isZipLibLoaded}
            styleOptions={styleOptions}
          />
        </div>
      </main>
    </div>
  );
}
