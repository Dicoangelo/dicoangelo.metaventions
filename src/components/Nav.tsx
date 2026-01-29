"use client";

import { ThemeToggle, useTheme } from "./ThemeProvider";

export default function Nav() {
  const { theme } = useTheme();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-lg ${
      theme === 'light'
        ? 'bg-white/90 border-gray-200'
        : 'bg-[#0a0a0a]/80 border-[#262626]'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">Dico Angelo</span>
        <div className={`flex items-center gap-6 text-sm ${
          theme === 'light' ? 'text-gray-600' : 'text-[#a3a3a3]'
        }`}>
          <a href="#proof" className={`hover:${theme === 'light' ? 'text-gray-900' : 'text-white'} transition-colors`}>Proof</a>
          <a href="#systems" className={`hover:${theme === 'light' ? 'text-gray-900' : 'text-white'} transition-colors`}>Systems</a>
          <a href="#projects" className={`hover:${theme === 'light' ? 'text-gray-900' : 'text-white'} transition-colors`}>Projects</a>
          <a href="#experience" className={`hover:${theme === 'light' ? 'text-gray-900' : 'text-white'} transition-colors`}>Experience</a>
          <a href="#arena" className={`hover:${theme === 'light' ? 'text-gray-900' : 'text-white'} transition-colors`}>Arena</a>
          <a href="#ask" className={`hover:${theme === 'light' ? 'text-gray-900' : 'text-white'} transition-colors`}>Ask</a>
          <a href="#contact" className={`hover:${theme === 'light' ? 'text-gray-900' : 'text-white'} transition-colors`}>Contact</a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
