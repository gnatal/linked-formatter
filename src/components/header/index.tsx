import { Image } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              LinkedIn Carousel Generator
            </h1>
          </div>
          <p className="text-gray-600">
            Transform your content into engaging carousel posts
          </p>
        </div>
      </div>
    </header>
  );
};
