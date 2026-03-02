"use client";

const columns = [
  {
    title: "Partner Side",
    icon: "🤝",
    items: ["$800M+ deal registration engine", "Co-sell motion with AWS & Microsoft", "6 CRM platform integrations", "GSI and cloud partner operations", "2x Microsoft Partner of the Year"],
    accent: false,
  },
  {
    title: "The Bridge",
    icon: "⚡",
    items: ["Partner use case identification", "GenAI enablement materials", "Business case development", "Technical ↔ business translation", "From partner pain to AI solution"],
    accent: true,
  },
  {
    title: "AI Side",
    icon: "🤖",
    items: ["58 MCP tools built on Claude", "Multi-agent orchestration framework", "4,035 Claude sessions", "Production AI pipelines", "GoMotion: Partner SA motion, live"],
    accent: false,
  },
];

export function BridgeSection({ isLight }: { isLight: boolean }) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">I speak both languages.</h2>
          <p className={`max-w-2xl mx-auto text-lg ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
            Most people live on one side. Partner ops people understand business but not the AI stack. AI builders understand the tech but not the co-sell motion. I&apos;ve operated both.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {columns.map(col => (
            <div key={col.title} className={`p-6 rounded-2xl border ${
              col.accent
                ? 'border-indigo-500 bg-indigo-600/10 shadow-lg shadow-indigo-500/10'
                : isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-white/5'
            }`}>
              <div className="text-3xl mb-3">{col.icon}</div>
              <h3 className={`text-lg font-bold mb-4 ${col.accent ? 'text-indigo-400' : ''}`}>{col.title}</h3>
              <ul className="space-y-2">
                {col.items.map(item => (
                  <li key={item} className={`text-sm flex items-start gap-2 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                    <span className="text-indigo-400 mt-0.5 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
