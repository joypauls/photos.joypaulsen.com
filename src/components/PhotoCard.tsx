"use client";

type Photo = {
  id: string;
  title?: string;
  caption?: string;
  previewUrl: string;
  originalUrl: string;
  w?: number;
  h?: number;
};

export default function PhotoCard({ photo }: { photo: Photo }) {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
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
        
        {photo.w && photo.h && (
          <p className="text-xs text-gray-500">
            {photo.w} × {photo.h} pixels
          </p>
        )}
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200"
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
  );
}
