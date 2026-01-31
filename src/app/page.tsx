"use client";

import { useTheme } from "@/components/ThemeProvider";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";

export default function Home() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />

      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Test: Nav + Hero</h2>
        <p className={isLight ? 'text-gray-600' : 'text-gray-400'}>
          Theme: {theme}
        </p>
      </section>
    </main>
  );
}
