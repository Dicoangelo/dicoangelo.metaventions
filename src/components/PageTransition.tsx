"use client";

import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className="transition-opacity duration-500 ease-out"
      style={{
        opacity: isLoaded ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
