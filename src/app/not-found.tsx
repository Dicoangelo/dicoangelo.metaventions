import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="max-w-lg text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#6366f1] mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="px-6 py-3 bg-[#6366f1] text-white rounded-lg font-semibold hover:bg-[#5558e3] transition-colors shadow-lg"
          >
            Go Home
          </Link>
          <Link
            href="/#contact"
            className="px-6 py-3 bg-[#1f1f1f] text-white rounded-lg font-semibold hover:bg-[#2a2a2a] transition-colors border border-[#262626]"
          >
            Contact Me
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          <p className="mb-2">Looking for something specific?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/#resume" className="text-[#6366f1] hover:underline">
              Resume
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/#projects" className="text-[#6366f1] hover:underline">
              Projects
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/#timeline" className="text-[#6366f1] hover:underline">
              Timeline
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/#skills" className="text-[#6366f1] hover:underline">
              Skills
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
