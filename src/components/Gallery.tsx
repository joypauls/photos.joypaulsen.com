'use client';

import PhotoCard from './PhotoCard';

type Photo = {
  id: string;
  title?: string;
  caption?: string;
  previewUrl: string;
  originalUrl: string;
  album?: string;
};

export default function Gallery({ photos }: { photos: Photo[] }) {
  return (
    <section className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
      {photos.map(p => <PhotoCard key={p.id} photo={p} />)}
    </section>
  );
}
