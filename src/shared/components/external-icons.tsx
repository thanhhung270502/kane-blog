"use client";

import React from "react";
import { cn } from "@tailwind-config/utils/cn";

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  className?: string;
}

export const ArrowLeftIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 28 14"
    fill="currentColor"
    className={cn("text-tertiary", className)}
    {...props}
  >
    <path
      d="M6.70274 0.648438L0.648682 6.70241M0.648682 6.70241L6.70274 12.7565M0.648682 6.70241H27.0271"
      stroke="currentColor"
      strokeWidth="1.2973"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowRightIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 28 14"
    fill="currentColor"
    className={cn("text-tertiary", className)}
    {...props}
  >
    <path
      d="M20.973 0.648438L27.0271 6.70241M27.0271 6.70241L20.973 12.7565M27.0271 6.70241H0.648682"
      stroke="currentColor"
      strokeWidth="1.2973"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ArrowLeftIcon.displayName = "ArrowLeftIcon";
ArrowRightIcon.displayName = "ArrowRightIcon";
