const AUTHOR_NAME = process.env.AUTHOR_NAME || "Joy Paulsen";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-75 transition-opacity"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M9.5 8.5c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2s2-.9 2-2h-1.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-3c0-.28.22-.5.5-.5s.5.22.5.5H11.5c0-1.1-.9-2-2-2zm5 0c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2s2-.9 2-2h-1.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-3c0-.28.22-.5.5-.5s.5.22.5.5H16.5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">CC BY 4.0</span>
            </a>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} {AUTHOR_NAME} · Licensed under{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                CC BY 4.0
              </a>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Free to use with attribution
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
