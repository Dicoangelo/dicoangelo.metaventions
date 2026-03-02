"use client";

export function GoMotionSection({ isLight }: { isLight: boolean }) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 bg-indigo-500/10 border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <span>⚡ Case Study</span>
        </div>
        {/* Featured card with accent border */}
        <div className={`p-8 rounded-2xl border-2 border-indigo-500/50 ${isLight ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : 'bg-gradient-to-br from-indigo-950/20 to-purple-950/20'}`}>
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">GoMotion: Partner Sales Orchestration Platform</h3>
              <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>Architected live in a single Claude session with a partner manager</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold">This is the Partner SA motion</span>
          </div>
          {/* Specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            {["4 core AI agents", "13 sub-agents", "MCP server", "MEDDPICC scoring", "Crossbeam + SF + HubSpot + Slack"].map(spec => (
              <div key={spec} className={`px-3 py-2 rounded-lg text-xs font-medium text-center ${isLight ? 'bg-white border border-gray-200' : 'bg-white/5 border border-white/10'}`}>{spec}</div>
            ))}
          </div>
          {/* Deliverables */}
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>Delivered Live</p>
            <div className="flex flex-wrap gap-2">
              {["Technical specification", "Onboarding playbooks", "MEDDPICC instruction set", "Orchestration quickstart guide"].map(d => (
                <span key={d} className={`px-3 py-1 rounded-full text-xs ${isLight ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-green-500/10 text-green-400 border border-green-500/30'}`}>✓ {d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
