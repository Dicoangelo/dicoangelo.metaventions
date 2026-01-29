import Chat from "@/components/Chat";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-[#262626]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-bold text-lg">Dico Angelo</span>
          <div className="flex gap-6 text-sm text-[#737373]">
            <a href="#proof" className="hover:text-white transition-colors">Proof</a>
            <a href="#systems" className="hover:text-white transition-colors">Systems</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#arena" className="hover:text-white transition-colors">Arena</a>
            <a href="#ask" className="hover:text-white transition-colors">Ask</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headshot */}
          <div className="mb-8">
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#6366f1] glow">
              <Image
                src="/headshot.png"
                alt="Dico Angelo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] border border-[#262626] text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[#737373]">Canadian Citizen · TN Visa Eligible</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Builder-Operator<br />
            <span className="gradient-text">Hybrid</span>
          </h1>

          <p className="text-xl text-[#a3a3a3] mb-8 max-w-2xl mx-auto">
            $800M+ in cloud partnerships managed. 85K+ lines of production AI systems built.
            I combine enterprise GTM execution with hands-on agentic infrastructure development.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <a
              href="https://os-app-woad.vercel.app"
              target="_blank"
              className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] rounded-lg font-medium transition-colors"
            >
              Live Demo: OS-App
            </a>
            <a
              href="https://github.com/Dicoangelo"
              target="_blank"
              className="px-6 py-3 bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] rounded-lg font-medium transition-colors"
            >
              GitHub (20 repos)
            </a>
          </div>

          <p className="text-sm text-[#525252] italic">
            &quot;I write 0 code. I orchestrate AI to write 100% of it. English is my programming language.&quot;
          </p>
        </div>
      </section>

      {/* Proof Section - Verifiable Metrics */}
      <section id="proof" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Verifiable Proof</h2>
            <p className="text-[#737373]">Every metric below has documentation. Click to see the evidence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Row 1 - Enterprise Metrics */}
            <MetricCard
              value="$800M+"
              label="TCV Managed"
              context="Cloud alliances at Contentsquare"
              proof="Salesforce deal registration records"
            />
            <MetricCard
              value="40%"
              label="Cloud Attachment"
              context="Microsoft Azure & AWS deals"
              proof="Quarterly reports, 2x Microsoft POY"
            />
            <MetricCard
              value="10%"
              label="Revenue Contribution"
              context="Via cloud alliance channel"
              proof="Company revenue attribution"
            />

            {/* Row 2 - Operational Metrics */}
            <MetricCard
              value="$222,750"
              label="Annual Savings"
              context="Rocket Mortgage Canada"
              proof="Process optimization documentation"
            />
            <MetricCard
              value="45"
              label="Team Size Led"
              context="90% satisfaction score"
              proof="Team management records"
            />
            <MetricCard
              value="98%"
              label="Accuracy Rate"
              context="Quality control metrics"
              proof="Performance reviews"
            />

            {/* Row 3 - Technical Metrics */}
            <MetricCard
              value="85K+"
              label="Lines of Code"
              context="Across 20 repositories"
              proof="GitHub commit history"
            />
            <MetricCard
              value="40+"
              label="Papers Implemented"
              context="arXiv research → production"
              proof="Code references with paper IDs"
            />
            <MetricCard
              value="2"
              label="npm Packages"
              context="Published & maintained"
              proof="npmjs.com/@metaventionsai"
            />
          </div>

          {/* Verification CTA */}
          <div className="text-center">
            <p className="text-sm text-[#525252] mb-4">
              Skeptical? Good. Verify everything.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://github.com/Dicoangelo" target="_blank" className="text-sm px-4 py-2 border border-[#262626] rounded-lg hover:bg-[#141414] transition-colors">
                GitHub Commits →
              </a>
              <a href="https://www.npmjs.com/org/metaventionsai" target="_blank" className="text-sm px-4 py-2 border border-[#262626] rounded-lg hover:bg-[#141414] transition-colors">
                npm Packages →
              </a>
              <a href="https://os-app-woad.vercel.app" target="_blank" className="text-sm px-4 py-2 border border-[#262626] rounded-lg hover:bg-[#141414] transition-colors">
                Live Demo →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Systems Section - META-VENGINE */}
      <section id="systems" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">META-VENGINE</h2>
            <p className="text-[#737373]">9-system self-improving AI infrastructure. The system that improves itself.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <SystemCard
              name="Cognitive OS"
              description="Energy-aware task routing based on 34K+ activity events"
              metric="Circadian-adaptive"
            />
            <SystemCard
              name="DQ Routing"
              description="Decision Quality scoring: Validity (40%) + Specificity (30%) + Correctness (30%)"
              metric="0.889 avg score"
            />
            <SystemCard
              name="Recovery Engine"
              description="Autonomous error detection and self-healing"
              metric="70% auto-fix rate"
            />
            <SystemCard
              name="Supermemory"
              description="Cross-session learning with spaced repetition"
              metric="700+ patterns"
            />
            <SystemCard
              name="Multi-Agent Coordinator"
              description="Parallel agent orchestration with file locking"
              metric="3+ concurrent"
            />
            <SystemCard
              name="ACE Consensus"
              description="Adaptive Consensus Engine with DQ-weighted voting"
              metric="50% faster consensus"
            />
            <SystemCard
              name="Observatory"
              description="Unified analytics across all systems"
              metric="Real-time metrics"
            />
            <SystemCard
              name="Context Packs V2"
              description="7-layer semantic context selection"
              metric="Smart prefetch"
            />
            <SystemCard
              name="Learning Hub"
              description="Cross-domain correlation and improvement suggestions"
              metric="Weekly sync"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#525252]">
              428K routing decisions logged · 94% error pattern coverage · Production since Nov 2025
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technical Projects</h2>
            <p className="text-[#737373]">Open source. Live demos. Verifiable code.</p>
          </div>

          <div className="space-y-6">
            <ProjectCard
              name="OS-App"
              tagline="Sovereign AI Operating System"
              description="Voice-native interface with Gemini 2.0 Live, ElevenLabs TTS, biometric stress detection. Adaptive Consensus Engine (ACE) reducing consensus rounds by 50%. Recursive Language Model (RLM) for 100x context extension."
              tech={["React 19", "TypeScript", "Gemini API", "ElevenLabs"]}
              stats={{ loc: "33K+", components: 71, services: 62, coverage: "95%" }}
              github="https://github.com/Dicoangelo/OS-App"
              demo="https://os-app-woad.vercel.app"
            />

            <ProjectCard
              name="ResearchGravity"
              tagline="Research Orchestration Platform"
              description="FastAPI backend with Qdrant vector search (2,530 embeddings). Meta-Learning Engine with 87% error prevention accuracy. Cognitive Precision Bridge with 5-agent ensemble and complexity-based routing."
              tech={["Python", "FastAPI", "Qdrant", "SQLite"]}
              stats={{ sessions: 114, findings: "2,530", urls: "8,935", accuracy: "87%" }}
              github="https://github.com/Dicoangelo/ResearchGravity"
            />

            <ProjectCard
              name="CareerCoachAntigravity"
              tagline="AI Career Governance System"
              description="Multi-agent hiring panel simulation. Generates role-specific feedback from AI personas representing different interview perspectives."
              tech={["Next.js 14", "TypeScript", "Zustand", "Claude API"]}
              stats={{ loc: "15K+", agents: 5, panels: "N/A" }}
              github="https://github.com/Dicoangelo/CareerCoachAntigravity"
            />
          </div>

          {/* npm Packages */}
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6 text-center">Published npm Packages</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h4 className="font-bold">@metaventionsai/cpb-core</h4>
                    <span className="text-sm text-[#737373]">v1.1.0</span>
                  </div>
                </div>
                <p className="text-sm text-[#a3a3a3] mb-4">
                  Cognitive Precision Bridge — AI orchestration with precision-aware routing.
                  Multi-provider LLM support, DQ scoring, adaptive model selection.
                </p>
                <code className="text-sm text-[#6366f1] bg-[#1a1a2e] px-3 py-2 rounded block">
                  npm install @metaventionsai/cpb-core
                </code>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h4 className="font-bold">@metaventionsai/voice-nexus</h4>
                    <span className="text-sm text-[#737373]">v1.1.0</span>
                  </div>
                </div>
                <p className="text-sm text-[#a3a3a3] mb-4">
                  Universal multi-provider voice architecture. STT, reasoning, TTS pipeline.
                  Echo elimination, sovereignty personality injection.
                </p>
                <code className="text-sm text-[#6366f1] bg-[#1a1a2e] px-3 py-2 rounded block">
                  npm install @metaventionsai/voice-nexus
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experience</h2>
            <p className="text-[#737373]">Enterprise operations → AI systems builder</p>
          </div>

          <div className="space-y-8">
            <TimelineItem
              period="Nov 2025 — Present"
              title="Founder & Systems Architect"
              company="Metaventions AI"
              location="Remote"
              highlights={[
                "Built OS-App: voice-native AI operating system (33K LOC)",
                "Published 2 npm packages for AI orchestration",
                "Created META-VENGINE: 9-system self-improving infrastructure",
                "Implemented 40+ arXiv papers into production systems"
              ]}
            />

            <TimelineItem
              period="May 2023 — Nov 2025"
              title="Cloud Alliance Manager & Partner Programs Lead"
              company="Contentsquare"
              location="Paris / Remote"
              highlights={[
                "Managed $800M+ TCV in registered deals (Microsoft Azure, AWS)",
                "Achieved 40% cloud attachment rate, 10% of company revenue",
                "Reduced deal registration time by 50% via CRM automation",
                "Contributed to 2x Microsoft Partner of the Year awards"
              ]}
            />

            <TimelineItem
              period="Jun 2020 — May 2023"
              title="Product Success Specialist"
              company="Rocket Mortgage Canada"
              location="Windsor, ON"
              highlights={[
                "Led team of 45 agents with 90% satisfaction score",
                "Delivered $222,750 annual cost savings via process optimization",
                "Achieved 98% accuracy in quality control",
                "Saved 7,425 hours/year through automation"
              ]}
            />

            <TimelineItem
              period="Mar 2019 — 2022"
              title="Director"
              company="Up2Youth"
              location="Windsor, ON"
              highlights={[
                "Secured $255,000 in funding over 3 years",
                "Directed 15 workshops annually serving 45 youth",
                "Increased program visibility 30% YoY"
              ]}
            />
          </div>

          {/* Education */}
          <div className="mt-12 card p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">🎓</span>
              <div>
                <h4 className="font-bold">University of Windsor — Odette School of Business</h4>
                <p className="text-[#737373]">Bachelor of Business Administration, Marketing · 2019</p>
                <p className="text-sm text-[#6366f1] mt-2">
                  SpaceX Hyperloop 2019 Competition Finalist — Business & Marketing Lead
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In The Arena - Human Side */}
      <section id="arena" className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">In The Arena</h2>
            <p className="text-[#737373] max-w-2xl mx-auto">
              150+ events across 8 cities over 7 years. Not just attending — building relationships,
              contributing to communities, and moving between worlds that rarely overlap.
            </p>
          </div>

          {/* Worlds I Move In */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <WorldCard
              title="Art & Culture"
              events="3 consecutive Art Basel Miami"
              insight="Where collectors, artists, VCs, and visionaries collide. Understanding taste, aesthetics, and the creative economy."
              highlights={["BitBasel", "Kaliner Gallery", "Superchief NFT"]}
            />
            <WorldCard
              title="Global Finance"
              events="F1: Miami, Monaco, Montreal"
              insight="The paddock, not the grandstand. International mobility and comfort in high-context environments."
              highlights={["Hamptons Legacy", "Family Office Forums", "Accredited Investor Roundtables"]}
            />
            <WorldCard
              title="Founder Networks"
              events="Builder Series NYC (monthly)"
              insight="Not transactional networking. Consistent presence, real relationships, mutual support over years."
              highlights={["Tavern Cohorts", "CoinFund Miami", "Startup Detroit"]}
            />
            <WorldCard
              title="Frontier Research"
              events="NeurIPS 2025"
              insight="Where papers become products. Proximity to the researchers pushing boundaries."
              highlights={["Thermo AI Meetup", "NVIDIA DGX Spark", "AWS Builder Loft"]}
            />
          </div>

          {/* Key Relationships */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-center">Circles & Access</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-5">
                <h4 className="font-bold text-[#6366f1] mb-3">Investor Networks</h4>
                <ul className="text-sm text-[#a3a3a3] space-y-2">
                  <li>• <strong>CoinFund</strong> — Monthly attendee, Jake Brukhman&apos;s events</li>
                  <li>• <strong>Pompliano</strong> — Invited to annual Christmas party</li>
                  <li>• <strong>BitAngels</strong> — Angel investor network access</li>
                  <li>• <strong>Maja Vujinovic</strong> — OGroup MD, FinTech/Digital Assets</li>
                </ul>
              </div>
              <div className="card p-5">
                <h4 className="font-bold text-[#6366f1] mb-3">Builder Communities</h4>
                <ul className="text-sm text-[#a3a3a3] space-y-2">
                  <li>• <strong>Detroit Blockchain</strong> — 15+ events, community pillar</li>
                  <li>• <strong>AI Collective Detroit</strong> — Active builder participant</li>
                  <li>• <strong>Web3 Toronto</strong> — Conference, Builder&apos;s Week regular</li>
                  <li>• <strong>AI Friends Toronto</strong> — Research community</li>
                </ul>
              </div>
              <div className="card p-5">
                <h4 className="font-bold text-[#6366f1] mb-3">Exclusive Access</h4>
                <ul className="text-sm text-[#a3a3a3] space-y-2">
                  <li>• <strong>Tavern Cohorts</strong> — Application-only founder programs</li>
                  <li>• <strong>Jeremy Piven events</strong> — Delmonico&apos;s, Legacy series</li>
                  <li>• <strong>Hamptons</strong> — Summer investor circuit</li>
                  <li>• <strong>Health Board Advisors</strong> — Mastermind member</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Geographic Footprint */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-center">Geographic Presence</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <LocationBadge city="Miami" count="40+" role="Primary Hub" />
              <LocationBadge city="Detroit" count="20+" role="Community Leader" />
              <LocationBadge city="NYC" count="15+" role="Founder Network" />
              <LocationBadge city="Toronto" count="15+" role="Canadian Tech" />
              <LocationBadge city="San Francisco" count="5+" role="Enterprise AI" />
              <LocationBadge city="Monaco" count="F1" role="International" />
              <LocationBadge city="Hamptons" count="3+" role="Investor Circuit" />
              <LocationBadge city="Cannes" count="1" role="Global Summit" />
            </div>
          </div>

          {/* What This Means */}
          <div className="card p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-4">What 150+ Events Actually Means</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left text-sm">
              <div>
                <p className="text-[#6366f1] font-medium mb-2">Cross-Cultural Fluency</p>
                <p className="text-[#a3a3a3]">Comfortable with artists, researchers, executives, investors, and founders. Can translate between worlds.</p>
              </div>
              <div>
                <p className="text-[#6366f1] font-medium mb-2">Early Adopter Pattern</p>
                <p className="text-[#a3a3a3]">AI events in Feb 2023 — before the boom. Sees what&apos;s coming, positions early.</p>
              </div>
              <div>
                <p className="text-[#6366f1] font-medium mb-2">Relationship Over Transaction</p>
                <p className="text-[#a3a3a3]">Same communities for 3+ years. Builder Series, CoinFund, Detroit Blockchain — consistent presence.</p>
              </div>
              <div>
                <p className="text-[#6366f1] font-medium mb-2">Community Builder</p>
                <p className="text-[#a3a3a3]">Not just attending — contributing. Education workshops, local scene building, advocacy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Certifications */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Skills & Certifications</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-[#6366f1]">AI / Agentic</h3>
              <div className="flex flex-wrap gap-2">
                {["Multi-agent orchestration", "Prompt engineering", "MCP", "Tool-using agents", "RLHF", "DQ scoring", "ACE consensus"].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-[#141414] border border-[#262626] rounded-full text-sm">{skill}</span>
                ))}
              </div>

              <h3 className="font-bold mb-4 mt-6 text-[#6366f1]">Technical</h3>
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "Python", "React 19", "Next.js", "FastAPI", "SQLite", "Qdrant", "Supabase", "Gemini API", "Claude API", "ElevenLabs"].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-[#141414] border border-[#262626] rounded-full text-sm">{skill}</span>
                ))}
              </div>

              <h3 className="font-bold mb-4 mt-6 text-[#6366f1]">GTM / Operations</h3>
              <div className="flex flex-wrap gap-2">
                {["Salesforce", "AWS Partner Central", "Crossbeam", "PartnerStack", "Deal registration", "Pipeline management", "CRM automation"].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-[#141414] border border-[#262626] rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-[#6366f1]">Certifications</h3>
              <div className="space-y-3">
                <CertBadge name="AWS Partner: Business Accreditation" year="2024" />
                <CertBadge name="AWS Partner: Generative AI on AWS Essentials" year="2023" />
                <CertBadge name="AWS Knowledge: Cloud Essentials" year="2024" />
                <CertBadge name="Microsoft Copilot for Security Sales Training" year="2024" />
              </div>

              <h3 className="font-bold mb-4 mt-6 text-[#6366f1]">Cloud & Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {["AWS (Partner Accredited)", "Azure (Conceptual)", "Vercel", "Supabase", "MongoDB"].map(platform => (
                  <span key={platform} className="px-3 py-1 bg-[#141414] border border-[#262626] rounded-full text-sm">{platform}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ask Me Anything */}
      <section id="ask" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ask Me Anything</h2>
            <p className="text-[#737373]">AI-powered chat that knows my entire portfolio. Go ahead, interrogate.</p>
          </div>
          <Chat />
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Let&apos;s Build</h2>
          <p className="text-[#737373] mb-8">
            Looking for roles at the intersection of AI systems and enterprise operations.
            TN Visa eligible. Open to SF, NYC, Austin, Boston, Toronto.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="mailto:dico.angelo97@gmail.com"
              className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] rounded-lg font-medium transition-colors"
            >
              dico.angelo97@gmail.com
            </a>
            <a
              href="tel:+15199996099"
              className="px-6 py-3 bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] rounded-lg font-medium transition-colors"
            >
              519-999-6099
            </a>
          </div>

          <div className="flex gap-6 justify-center">
            <a href="https://linkedin.com/in/dicoangelo" target="_blank" className="text-[#737373] hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="https://github.com/Dicoangelo" target="_blank" className="text-[#737373] hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com/dicoangelo" target="_blank" className="text-[#737373] hover:text-white transition-colors">
              Twitter
            </a>
            <a href="https://metaventions.com" target="_blank" className="text-[#737373] hover:text-white transition-colors">
              Metaventions
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#262626]">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-[#525252]">
          <span>&copy; 2026 Dico Angelo</span>
          <span>Built with AI orchestration · 0 lines written manually</span>
        </div>
      </footer>
    </main>
  );
}

// Components

function MetricCard({ value, label, context, proof }: { value: string; label: string; context: string; proof: string }) {
  return (
    <div className="metric-card p-6 rounded-xl">
      <div className="text-3xl font-bold gradient-text mb-1">{value}</div>
      <div className="font-medium mb-2">{label}</div>
      <div className="text-sm text-[#737373] mb-2">{context}</div>
      <div className="text-xs text-[#525252] italic">Proof: {proof}</div>
    </div>
  );
}

function SystemCard({ name, description, metric }: { name: string; description: string; metric: string }) {
  return (
    <div className="card p-5 hover:border-[#6366f1]/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold">{name}</h4>
        <span className="text-xs px-2 py-1 bg-[#6366f1]/10 text-[#6366f1] rounded">{metric}</span>
      </div>
      <p className="text-sm text-[#737373]">{description}</p>
    </div>
  );
}

function ProjectCard({
  name,
  tagline,
  description,
  tech,
  stats,
  github,
  demo
}: {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  stats: Record<string, string | number>;
  github: string;
  demo?: string;
}) {
  return (
    <div className="card p-6 glow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-[#6366f1]">{tagline}</p>
        </div>
        <div className="flex gap-2">
          <a href={github} target="_blank" className="px-3 py-1 text-sm border border-[#262626] rounded hover:bg-[#1f1f1f] transition-colors">
            GitHub
          </a>
          {demo && (
            <a href={demo} target="_blank" className="px-3 py-1 text-sm bg-[#6366f1] rounded hover:bg-[#5558e3] transition-colors">
              Live Demo
            </a>
          )}
        </div>
      </div>

      <p className="text-[#a3a3a3] mb-4">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map(t => (
          <span key={t} className="px-2 py-1 bg-[#1f1f1f] rounded text-xs">{t}</span>
        ))}
      </div>

      <div className="flex gap-6 text-sm">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key}>
            <span className="text-[#737373]">{key}: </span>
            <span className="font-medium">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({
  period,
  title,
  company,
  location,
  highlights
}: {
  period: string;
  title: string;
  company: string;
  location: string;
  highlights: string[];
}) {
  return (
    <div className="relative pl-6 border-l-2 border-[#262626]">
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#6366f1]"></div>
      <div className="text-sm text-[#6366f1] mb-1">{period}</div>
      <h4 className="text-lg font-bold">{title}</h4>
      <div className="text-[#737373] mb-3">{company} · {location}</div>
      <ul className="space-y-1">
        {highlights.map((h, i) => (
          <li key={i} className="text-sm text-[#a3a3a3] flex gap-2">
            <span className="text-[#6366f1]">→</span> {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CertBadge({ name, year }: { name: string; year: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#141414] rounded-lg">
      <span className="text-lg">🏆</span>
      <div className="flex-1">
        <div className="text-sm font-medium">{name}</div>
      </div>
      <span className="text-xs text-[#737373]">{year}</span>
    </div>
  );
}

function WorldCard({
  title,
  events,
  insight,
  highlights
}: {
  title: string;
  events: string;
  insight: string;
  highlights: string[];
}) {
  return (
    <div className="card p-5 h-full">
      <h4 className="font-bold text-[#6366f1] mb-1">{title}</h4>
      <p className="text-xs text-[#737373] mb-3">{events}</p>
      <p className="text-sm text-[#a3a3a3] mb-3">{insight}</p>
      <div className="flex flex-wrap gap-1">
        {highlights.map(h => (
          <span key={h} className="text-xs px-2 py-1 bg-[#1f1f1f] rounded">{h}</span>
        ))}
      </div>
    </div>
  );
}

function LocationBadge({ city, count, role }: { city: string; count: string; role: string }) {
  return (
    <div className="px-4 py-2 bg-[#141414] border border-[#262626] rounded-lg text-center">
      <div className="font-bold">{city}</div>
      <div className="text-xs text-[#6366f1]">{count} events</div>
      <div className="text-xs text-[#525252]">{role}</div>
    </div>
  );
}
