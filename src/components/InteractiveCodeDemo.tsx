"use client";

import { useState } from "react";

interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  demo?: React.ReactNode;
}

interface InteractiveCodeDemoProps {
  isLight: boolean;
}

export default function InteractiveCodeDemo({ isLight }: InteractiveCodeDemoProps) {
  const [selectedExample, setSelectedExample] = useState(0);
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const examples: CodeExample[] = [
    {
      id: "react-hooks",
      title: "React State Management",
      description: "Clean state management with React hooks",
      language: "typescript",
      code: `const [count, setCount] = useState(0);

return (
  <button onClick={() => setCount(count + 1)}>
    Clicked {count} times
  </button>
);`,
      demo: (
        <div className="p-6 rounded-lg border border-[#262626] bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5">
          <button
            onClick={() => setCount(count + 1)}
            className="px-6 py-3 bg-[#6366f1] text-white rounded-lg hover:bg-[#4f46e5] transition-all hover:scale-105 active:scale-95"
          >
            Clicked {count} times
          </button>
          <p className="mt-4 text-sm text-[#a3a3a3]">
            Live demo using React hooks
          </p>
        </div>
      ),
    },
    {
      id: "typescript",
      title: "TypeScript Type Safety",
      description: "Strongly typed interfaces for better DX",
      language: "typescript",
      code: `interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  metadata?: Record<string, any>;
}

function getUser(id: string): Promise<User> {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json());
}`,
      demo: (
        <div className="p-6 rounded-lg border border-[#262626] bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[#6366f1] font-mono text-sm">interface</span>
              <span className="text-white font-mono">User</span>
            </div>
            <div className="pl-6 space-y-2 text-sm font-mono">
              <div className="text-[#a3a3a3]">id: <span className="text-[#8b5cf6]">string</span></div>
              <div className="text-[#a3a3a3]">name: <span className="text-[#8b5cf6]">string</span></div>
              <div className="text-[#a3a3a3]">role: <span className="text-[#a855f7]">'admin' | 'user'</span></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "async-await",
      title: "Async/Await Patterns",
      description: "Modern async JavaScript patterns",
      language: "typescript",
      code: `async function processData() {
  try {
    const data = await fetchData();
    const validated = await validate(data);
    const result = await transform(validated);
    return result;
  } catch (error) {
    logger.error('Processing failed', error);
    throw new ProcessingError(error);
  }
}`,
      demo: (
        <div className="p-6 rounded-lg border border-[#262626] bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5">
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[#a3a3a3]">Fetching data...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-[#a3a3a3]">Validating...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[#a3a3a3]">Transforming...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-white">Complete ✓</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "tailwind",
      title: "Utility-First CSS",
      description: "Rapid UI development with Tailwind",
      language: "tsx",
      code: `<div className="
  flex items-center gap-4
  px-6 py-4 rounded-lg
  bg-gradient-to-r from-blue-500 to-purple-500
  hover:scale-105 transition-transform
  shadow-lg hover:shadow-xl
">
  <span className="text-white font-bold">
    Beautiful Components
  </span>
</div>`,
      demo: (
        <div className="p-6 rounded-lg border border-[#262626] bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
            className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] border border-[#262626] text-white placeholder:text-[#525252] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all"
          />
          {text && (
            <p className="mt-3 text-sm text-[#a3a3a3]">
              You typed: <span className="text-white font-mono">{text}</span>
            </p>
          )}
        </div>
      ),
    },
  ];

  const currentExample = examples[selectedExample];

  return (
    <section
      id="code-examples"
      className={`py-20 px-6 ${
        isLight
          ? "bg-gradient-to-b from-gray-50 to-white"
          : "bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Interactive Code Examples</h2>
          <p className={`text-sm ${isLight ? "text-gray-600" : "text-[#737373]"}`}>
            Live demonstrations of technical skills
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Code Editor */}
          <div>
            {/* Tab selector */}
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
              {examples.map((example, index) => (
                <button
                  key={example.id}
                  onClick={() => setSelectedExample(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedExample === index
                      ? isLight
                        ? "bg-[#6366f1] text-white"
                        : "bg-[#6366f1] text-white"
                      : isLight
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-[#1f1f1f] text-[#a3a3a3] hover:bg-[#2a2a2a]"
                  }`}
                >
                  {example.title}
                </button>
              ))}
            </div>

            {/* Code display */}
            <div
              className={`rounded-lg overflow-hidden ${
                isLight ? "bg-gray-100 border border-gray-200" : "bg-[#1a1a2e] border border-[#262626]"
              }`}
            >
              {/* Header */}
              <div className={`px-4 py-3 flex items-center justify-between border-b ${
                isLight ? "border-gray-200 bg-gray-50" : "border-[#262626] bg-[#1f1f1f]"
              }`}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className={`ml-3 text-xs font-mono ${
                    isLight ? "text-gray-600" : "text-[#737373]"
                  }`}>
                    {currentExample.language}
                  </span>
                </div>
                <span className={`text-xs ${isLight ? "text-gray-500" : "text-[#525252]"}`}>
                  {currentExample.description}
                </span>
              </div>

              {/* Code content */}
              <pre className={`p-6 overflow-x-auto scrollbar-thin ${
                isLight ? "text-gray-800" : "text-[#ededed]"
              }`}>
                <code className="text-sm font-mono leading-relaxed whitespace-pre">
                  {currentExample.code}
                </code>
              </pre>
            </div>
          </div>

          {/* Live Demo */}
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">Live Demo</h3>
              <p className={`text-sm ${isLight ? "text-gray-600" : "text-[#737373]"}`}>
                Interactive example you can try
              </p>
            </div>
            {currentExample.demo || (
              <div className={`p-8 rounded-lg border text-center ${
                isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#141414] border-[#262626] text-[#525252]"
              }`}>
                <p>No interactive demo for this example</p>
              </div>
            )}
          </div>
        </div>

        {/* Tech stack badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            "TypeScript",
            "React 19",
            "Next.js 16",
            "Tailwind CSS",
            "Zustand",
            "Node.js",
          ].map((tech) => (
            <span
              key={tech}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isLight
                  ? "bg-gray-100 text-gray-700 border border-gray-200"
                  : "bg-[#1f1f1f] text-[#a3a3a3] border border-[#262626]"
              }`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
