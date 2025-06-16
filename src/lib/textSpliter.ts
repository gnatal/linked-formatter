export const splitTextIntoSlides = (text: string): string[] => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const maxWordsPerSlide = 35;
  const minWordsPerSlide = 15;
  const slides: string[] = [];
  
  let currentSlide = '';
  let wordCount = 0;
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    const sentenceWords = sentence.split(' ').length;
    
    if (wordCount + sentenceWords > maxWordsPerSlide && wordCount >= minWordsPerSlide) {
      slides.push(currentSlide.trim());
      currentSlide = sentence;
      wordCount = sentenceWords;
    } else {
      currentSlide += (currentSlide ? '. ' : '') + sentence;
      wordCount += sentenceWords;
    }
    
    if (i === sentences.length - 1 && currentSlide.trim()) {
      slides.push(currentSlide.trim());
    }
  }
  
  return slides;
};