import Gallery from "@/components/Gallery";
import Header from "@/components/Header";
import photos from "@/data/photos.json";

const SITE_NAME = process.env.SITE_NAME || "Free Photo Downloads";
const PACK_URL = process.env.PACK_URL || "";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header siteName={SITE_NAME} packUrl={PACK_URL} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Gallery photos={photos as any} />
      </main>
    </div>
  );
}
