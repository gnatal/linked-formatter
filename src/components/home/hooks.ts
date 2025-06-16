import { useState, useCallback } from 'react';
import { Slide, StyleOptions, AppState } from '../types';

export const useCarouselGenerator = () => {
  const [state, setState] = useState<AppState>({
    inputText: '',
    slides: [],
    currentSlide: 0,
    styleOptions: {
      template: 'professional',
      colorScheme: 'linkedin',
      fontSize: 'medium'
    },
    isGenerating: false,
    isExporting: false,
    editingSlide: null
  });

  const setInputText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, inputText: text }));
  }, []);

  const setCurrentSlide = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentSlide: index }));
  }, []);

  const setStyleOptions = useCallback((options: Partial<StyleOptions>) => {
    setState((prev) => ({
      ...prev,
      styleOptions: { ...prev.styleOptions, ...options }
    }));
  }, []);

  const setSlides = useCallback((slides: Slide[]) => {
    setState((prev) => ({ ...prev, slides }));
  }, []);

  const setGenerating = useCallback((isGenerating: boolean) => {
    setState((prev) => ({ ...prev, isGenerating }));
  }, []);

  const setExporting = useCallback((isExporting: boolean) => {
    setState((prev) => ({ ...prev, isExporting }));
  }, []);

  const setEditingSlide = useCallback((slideId: string | null) => {
    setState((prev) => ({ ...prev, editingSlide: slideId }));
  }, []);

  return {
    state,
    setInputText,
    setCurrentSlide,
    setStyleOptions,
    setSlides,
    setGenerating,
    setExporting,
    setEditingSlide
  };
};