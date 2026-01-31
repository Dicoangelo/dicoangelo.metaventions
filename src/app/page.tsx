"use client";

import { useTheme } from "@/components/ThemeProvider";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />

      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Incremental Component Test</h2>
        <p className={isLight ? 'text-gray-600' : 'text-gray-400'}>
          Basic structure with Nav, Hero, and Footer
        </p>
      </section>

      <Footer isLight={isLight} />
    </main>
  );
}
