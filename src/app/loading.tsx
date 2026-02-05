/**
 * Root Loading Component - Premium Skeleton
 * Shows while the page is loading for better perceived performance
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Nav Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-6 flex items-center justify-between bg-[var(--background)]/80 backdrop-blur-lg border-b border-[var(--border)]">
        <div className="h-8 w-32 bg-[var(--card)] rounded animate-pulse" />
        <div className="hidden md:flex gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-16 bg-[var(--card)] rounded animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-10 bg-[var(--card)] rounded-full animate-pulse" />
      </nav>

      {/* Hero Skeleton */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-4xl mx-auto w-full">
          {/* Headshot skeleton */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full bg-[var(--card)] animate-pulse" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-4 text-center">
            <div className="h-12 w-3/4 mx-auto bg-[var(--card)] rounded animate-pulse" />
            <div className="h-8 w-2/3 mx-auto bg-[var(--card)] rounded animate-pulse" />
            <div className="h-6 w-1/2 mx-auto bg-[var(--card)] rounded animate-pulse mt-6" />
          </div>

          {/* CTA buttons skeleton */}
          <div className="flex justify-center gap-4 mt-10">
            <div className="h-12 w-36 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/10 rounded-xl animate-pulse" />
            <div className="h-12 w-36 bg-[var(--card)] rounded-xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Gradient orbs for visual interest */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        />
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-2 bg-[var(--card)] rounded-full border border-[var(--border)] shadow-lg">
        <div className="relative w-5 h-5">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        </div>
        <span className="text-sm text-[var(--muted)]">Loading...</span>
      </div>
    </div>
  );
}
