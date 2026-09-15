import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-[#f7f7f2] text-[#1b2b24]">
      <div className="max-w-xl">
        <Link href="/" className="text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-4">Dico Angelo.</Link>
        <p className="mt-16 text-sm font-semibold uppercase tracking-widest text-[#315d4c]">404 / Page not found</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">Let’s get you back.</h1>
        <p className="mt-5 text-lg leading-relaxed text-[#526057]">This page may have moved. You can find my experience, selected work, and résumé on the homepage.</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link href="/" className="inline-flex bg-[#315d4c] px-6 py-3 font-semibold text-white hover:bg-[#244939] focus-visible:outline-2 focus-visible:outline-offset-4">Back to homepage</Link>
          <Link href="/#resume" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">View résumé</Link>
        </div>
      </div>
    </main>
  );
}
