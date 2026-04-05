"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@tailwind-config/utils/cn";
import { type HTMLMotionProps, motion } from "framer-motion";

interface LiquidGlassProps extends Omit<HTMLMotionProps<"div">, "children"> {
  blur?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  hoverable?: boolean;
  children?: ReactNode;
}

const blurMap = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
  ({ className, blur = "md", glow = false, hoverable = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-2xl",
          "bg-white/5",
          blurMap[blur],
          "border border-white/10",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
          "shadow-xl shadow-black/20",
          glow && "shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20",
          hoverable && "transition-all duration-300 hover:border-white/20 hover:bg-white/10",
          className
        )}
        {...props}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

LiquidGlass.displayName = "LiquidGlass";
