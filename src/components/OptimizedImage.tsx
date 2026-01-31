"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  showLoader?: boolean;
}

export default function OptimizedImage({
  showLoader = true,
  className = "",
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {showLoader && !isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 animate-shimmer" />
      )}
      <Image
        {...props}
        className={`transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}
