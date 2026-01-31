export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Server-Side Test</h1>
        <p className="text-gray-400">This is a pure server component with no client code.</p>
        <p className="text-gray-500 text-sm mt-4">If you see this, the server rendering works!</p>
      </div>
    </main>
  );
}
