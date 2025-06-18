"use client";
import React from "react";
import { useCodeToImage } from "./useCodeToImage";
import {
  Header,
  Navigation,
  CodeInput,
  CodePreview,
  ChunkOverview,
} from "./components";

const CodeToImageConverter: React.FC = () => {
  const {
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
    setCurrentIndex,
  } = useCodeToImage();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          onAddChunk={addChunk}
          onRemoveChunk={removeChunk}
          onDownloadAll={downloadAll}
          canRemoveChunk={chunks.length > 1}
        />

        <Navigation
          currentIndex={currentIndex}
          totalChunks={chunks.length}
          onNavigate={navigateChunk}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CodeInput
            code={currentChunk.code}
            onCodeChange={updateCurrentChunk}
            characterCount={currentChunk.code.length}
          />

          <CodePreview
            image={currentChunk.image}
            isGenerating={isGenerating}
            hasCode={currentChunk.code.trim().length > 0}
            onDownload={downloadCurrent}
            previewRef={previewRef}
            code={currentChunk.code}
            currentIndex={currentIndex}
          />
        </div>

        <ChunkOverview
          chunks={chunks}
          currentIndex={currentIndex}
          onChunkSelect={setCurrentIndex}
        />
      </div>
    </div>
  );
};

export default CodeToImageConverter;
