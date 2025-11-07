import Gallery from '@/components/Gallery';
import photos from '@/data/photos.json';

const SITE_NAME = process.env.SITE_NAME || 'Free Photo Downloads';
const PACK_URL = process.env.PACK_URL || '';

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{SITE_NAME}</h1>
        {PACK_URL ? (
          <a
            className="inline-flex items-center border border-black rounded-lg px-3 py-2 hover:bg-black hover:text-white transition"
            href={PACK_URL}
          >
            Download all
          </a>
        ) : null}
      </header>
      <Gallery photos={photos as any} />
    </main>
  );
}
