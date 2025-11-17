"use client";

import { useState } from "react";

type Photo = {
  id: string;
  title?: string;
  caption?: string;
  previewUrl: string;
  originalUrl: string;
  w?: number;
  h?: number;
  location?: string | null;
};

export default function PhotoCard({ photo }: { photo: Photo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.originalUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = photo.title || photo.id;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback to direct link if fetch fails
      const link = document.createElement("a");
      link.href = photo.originalUrl;
      link.download = photo.title || photo.id;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div className="relative w-full h-48 bg-gray-100 flex-shrink-0">
          <img
            src={photo.previewUrl}
            alt={photo.title || `Photo ${photo.id}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-4 flex-grow">
          <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
            {photo.title || `Photo ${photo.id}`}
          </h3>
          
          {photo.location && (
            <p className="text-xs text-gray-600 mb-1 truncate">
              📍 {photo.location}
            </p>
          )}
          
          {photo.w && photo.h && (
            <p className="text-xs text-gray-500">
              {photo.w} × {photo.h} pixels
            </p>
          )}
        </div>

        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 active:bg-gray-800 transition-colors duration-200"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
              />
            </svg>
            Preview
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Full-screen Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-20"
            aria-label="Close preview"
          >
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>

          {/* Centered image - constrained to leave room for info bar */}
          <div 
            className="w-full h-full flex items-center justify-center p-4 pb-24"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photo.previewUrl}
              alt={photo.title || `Photo ${photo.id}`}
              className="max-w-full max-h-full object-contain"
              style={{ display: 'block' }}
            />
          </div>

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 z-20">
            <h3 className="text-lg font-semibold">
              {photo.title || `Photo ${photo.id}`}
            </h3>
            {photo.location && (
              <p className="text-sm text-gray-300 mb-1">
                📍 {photo.location}
              </p>
            )}
            {photo.w && photo.h && (
              <p className="text-sm text-gray-300">
                {photo.w} × {photo.h} pixels
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
