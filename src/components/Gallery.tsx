"use client";

import PhotoCard from "./PhotoCard";

type Photo = {
  id: string;
  title?: string;
  caption?: string;
  previewUrl: string;
  originalUrl: string;
  album?: string;
  w?: number;
  h?: number;
};

export default function Gallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Photo Gallery
        </h2>
        <p className="text-lg text-gray-600">
          {photos.length} {photos.length === 1 ? 'photo' : 'photos'} available for download
        </p>
      </div>

      {/* Grid - 1 column on mobile, 3 on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
}
