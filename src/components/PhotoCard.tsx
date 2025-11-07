'use client';

type Photo = {
  id: string;
  title?: string;
  caption?: string;
  previewUrl: string;
  originalUrl: string;
};

export default function PhotoCard({ photo }: { photo: Photo }) {
  return (
    <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <img
        src={photo.previewUrl}
        alt={photo.title || ''}
        loading="lazy"
        className="w-full aspect-[4/3] object-cover"
      />
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold truncate">{photo.title || ''}</div>
          <a
            className="inline-flex items-center border border-black rounded-lg px-3 py-2 text-sm hover:bg-black hover:text-white transition"
            href={photo.originalUrl}
            download
          >
            Download
          </a>
        </div>
        {photo.caption && <div className="mt-1 text-sm text-gray-600">{photo.caption}</div>}
      </div>
    </article>
  );
}
