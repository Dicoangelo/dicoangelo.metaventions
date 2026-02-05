"use client";

import { useState, useRef, useEffect, ReactNode, ButtonHTMLAttributes, forwardRef } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Premium Button with magnetic hover effect and micro-interactions
 */
interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  magneticStrength?: number;
  glowOnHover?: boolean;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      magneticStrength = 0.3,
      glowOnHover = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) * magneticStrength;
      const y = (e.clientY - centerY) * magneticStrength;
      setPosition({ x, y });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-7 py-3.5 text-lg",
    };

    const variantClasses = {
      primary: isLight
        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
        : "bg-indigo-600 hover:bg-indigo-500 text-white",
      secondary: isLight
        ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
        : "bg-white/10 hover:bg-white/15 text-white",
      ghost: isLight
        ? "bg-transparent hover:bg-gray-100 text-gray-700"
        : "bg-transparent hover:bg-white/5 text-gray-300",
      outline: isLight
        ? "border border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600"
        : "border border-white/20 hover:border-indigo-500 text-gray-300 hover:text-indigo-400",
    };

    return (
      <button
        ref={(node) => {
          (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={`
          relative inline-flex items-center justify-center gap-2 rounded-xl font-medium
          transition-all duration-300 ease-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
          active:scale-[0.98]
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          boxShadow:
            glowOnHover && isHovered && variant === "primary"
              ? isLight
                ? "0 0 30px rgba(99, 102, 241, 0.4)"
                : "0 0 40px rgba(99, 102, 241, 0.5)"
              : undefined,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Shine effect on hover */}
        <span
          className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none"
          aria-hidden="true"
        >
          <span
            className={`
              absolute inset-0 -translate-x-full transition-transform duration-500
              ${isHovered ? "translate-x-full" : ""}
            `}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            }}
          />
        </span>
        {children}
      </button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

/**
 * Interactive Card with 3D tilt effect
 */
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltStrength?: number;
  glowColor?: string;
}

export function TiltCard({
  children,
  className = "",
  tiltStrength = 10,
  glowColor,
}: TiltCardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateY = (mouseX / (rect.width / 2)) * tiltStrength;
    const rotateX = -(mouseY / (rect.height / 2)) * tiltStrength;

    setTransform({ rotateX, rotateY });
    setGlowPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const defaultGlow = isLight ? "rgba(99, 102, 241, 0.15)" : "rgba(139, 92, 246, 0.25)";

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect following cursor */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor || defaultGlow}, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

/**
 * Copy to clipboard button with feedback animation
 */
interface CopyButtonProps {
  textToCopy: string;
  children?: ReactNode;
  className?: string;
  onCopy?: () => void;
}

export function CopyButton({ textToCopy, children, className = "", onCopy }: CopyButtonProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        relative inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg
        text-sm font-medium transition-all duration-200
        ${
          copied
            ? "bg-green-500/20 text-green-500"
            : isLight
            ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
            : "bg-white/10 hover:bg-white/15 text-gray-300"
        }
        ${className}
      `}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {/* Icon transition */}
      <span className="relative w-4 h-4">
        {/* Copy icon */}
        <svg
          className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
            copied ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {/* Check icon */}
        <svg
          className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
            copied ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
      {children || (copied ? "Copied!" : "Copy")}

      {/* Ripple effect */}
      {copied && (
        <span
          className="absolute inset-0 rounded-lg animate-ping bg-green-500/20"
          style={{ animationDuration: "0.5s", animationIterationCount: 1 }}
        />
      )}
    </button>
  );
}

/**
 * Animated focus input with floating label
 */
interface FocusInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FocusInput({ label, error, className = "", ...props }: FocusInputProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  const isFloating = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <input
        {...props}
        onChange={handleChange}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={`
          peer w-full px-4 py-3 pt-6 rounded-xl border-2 outline-none
          transition-all duration-200
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : isFocused
              ? "border-indigo-500"
              : isLight
              ? "border-gray-200 focus:border-indigo-500"
              : "border-white/10 focus:border-indigo-500"
          }
          ${isLight ? "bg-white text-gray-900" : "bg-white/5 text-white"}
        `}
        placeholder=" "
      />
      <label
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${
            isFloating
              ? "top-2 text-xs font-medium"
              : "top-1/2 -translate-y-1/2 text-base"
          }
          ${
            error
              ? "text-red-500"
              : isFocused
              ? "text-indigo-500"
              : isLight
              ? "text-gray-500"
              : "text-gray-400"
          }
        `}
      >
        {label}
      </label>

      {/* Focus glow effect */}
      <div
        className={`
          absolute inset-0 -z-10 rounded-xl transition-opacity duration-300
          ${isFocused ? "opacity-100" : "opacity-0"}
        `}
        style={{
          boxShadow: error
            ? "0 0 0 4px rgba(239, 68, 68, 0.1)"
            : "0 0 0 4px rgba(99, 102, 241, 0.1)",
        }}
      />

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Pulse indicator for live/active states
 */
interface PulseIndicatorProps {
  color?: "green" | "red" | "yellow" | "blue" | "purple";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PulseIndicator({ color = "green", size = "md", className = "" }: PulseIndicatorProps) {
  const colors = {
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  };

  const pulseColors = {
    green: "bg-green-400",
    red: "bg-red-400",
    yellow: "bg-yellow-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <span className={`relative inline-flex ${sizes[size]} ${className}`}>
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColors[color]}`}
      />
      <span className={`relative inline-flex rounded-full h-full w-full ${colors[color]}`} />
    </span>
  );
}

/**
 * Skeleton loading with shimmer effect
 */
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = "", variant = "text", width, height }: SkeletonProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`
        animate-pulse
        ${isLight ? "bg-gray-200" : "bg-white/10"}
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        width: width,
        height: height || (variant === "text" ? "1em" : undefined),
      }}
    >
      {/* Shimmer overlay */}
      <div
        className="w-full h-full relative overflow-hidden"
        style={{
          background: `linear-gradient(90deg, transparent, ${
            isLight ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"
          }, transparent)`,
          animation: "shimmer 1.5s infinite",
        }}
      />
    </div>
  );
}

/**
 * Hover reveal - shows content on hover with animation
 */
interface HoverRevealProps {
  children: ReactNode;
  revealContent: ReactNode;
  className?: string;
}

export function HoverReveal({ children, revealContent, className = "" }: HoverRevealProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main content */}
      <div
        className="transition-all duration-300"
        style={{
          transform: isHovered ? "translateY(-10px)" : "translateY(0)",
          opacity: isHovered ? 0.7 : 1,
        }}
      >
        {children}
      </div>

      {/* Reveal content */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-300"
        style={{
          transform: isHovered ? "translateY(0)" : "translateY(100%)",
          opacity: isHovered ? 1 : 0,
        }}
      >
        {revealContent}
      </div>
    </div>
  );
}
