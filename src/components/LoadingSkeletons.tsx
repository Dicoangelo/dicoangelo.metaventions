"use client";

interface SkeletonProps {
  isLight?: boolean;
}

export function ChatSkeleton({ isLight = false }: SkeletonProps) {
  return (
    <div className={`card max-w-5xl mx-auto overflow-hidden ${isLight ? 'bg-white' : 'bg-[#0f0f1f]'}`}>
      <div className={`p-4 border-b animate-pulse ${isLight ? 'border-gray-200 bg-gray-50' : 'border-[#262626] bg-[#1a1a1a]'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
          <div className="flex-1">
            <div className={`h-4 w-32 rounded mb-2 ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
            <div className={`h-3 w-48 rounded ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row min-h-[450px]">
        <div className={`lg:w-1/2 p-6 flex items-center justify-center ${isLight ? 'bg-gray-50' : 'bg-[#0a0a0a]'}`}>
          <div className={`w-32 h-32 rounded-full animate-pulse ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
        </div>
        <div className={`lg:w-1/2 flex flex-col ${isLight ? 'bg-white' : 'bg-[#0a0a0a]'}`}>
          <div className="h-[350px] p-4 space-y-3 animate-pulse">
            <div className={`h-16 w-3/4 rounded-lg ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
            <div className={`h-16 w-2/3 rounded-lg ml-auto ${isLight ? 'bg-blue-100' : 'bg-[#6366f1]/20'}`} />
            <div className={`h-16 w-3/4 rounded-lg ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function JDAnalyzerSkeleton({ isLight = false }: SkeletonProps) {
  return (
    <div className="animate-pulse space-y-4">
      <div className={`p-4 rounded-lg ${isLight ? 'bg-gray-100' : 'bg-[#141414]'}`}>
        <div className={`h-4 w-full rounded mb-3 ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
        <div className={`h-4 w-5/6 rounded ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
      </div>
      <div className={`h-32 rounded-lg ${isLight ? 'bg-gray-100' : 'bg-[#141414]'}`} />
      <div className={`h-12 rounded-lg w-32 ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
    </div>
  );
}

export function ComponentSkeleton({ isLight = false, height = "400px" }: SkeletonProps & { height?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${isLight ? 'bg-gray-100' : 'bg-[#141414]'}`}
      style={{ height }}
    >
      <div className="p-6 space-y-4">
        <div className={`h-8 w-48 rounded ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
        <div className={`h-4 w-full rounded ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
        <div className={`h-4 w-5/6 rounded ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
      </div>
    </div>
  );
}

export function SectionSkeleton({ isLight = false }: SkeletonProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="text-center mb-12">
          <div className={`h-8 w-64 mx-auto rounded mb-4 ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
          <div className={`h-4 w-96 mx-auto rounded ${isLight ? 'bg-gray-200' : 'bg-[#262626]'}`} />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-48 rounded-xl ${isLight ? 'bg-gray-100' : 'bg-[#141414]'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
