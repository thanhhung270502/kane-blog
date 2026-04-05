"use client";

import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { ListIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";

// import { useComparisonContainerStyle } from "./use-comparison-container-style";

type SliderComparisonProps = {
  leftUrl: string;
  rightUrl: string;
  className?: string;
};

export function SliderComparison({ leftUrl, rightUrl, className }: SliderComparisonProps) {
  // const { containerStyle } = useComparisonContainerStyle({ leftUrl, rightUrl });

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg",
        className
      )}
    >
      <ReactCompareSlider
        handle={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            <div style={{ width: "4px", flex: 1, background: "var(--color-teal-850)" }} />
            <div style={{
              background: "var(--color-teal-850)",
              borderRadius: "999px",
              width: "36px",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <ListIcon size={20} color="white" style={{ transform: "rotate(90deg)" }} />
            </div>
            <div style={{ width: "4px", flex: 1, background: "var(--color-teal-850)" }} />
          </div>
        }
        itemOne={
          <ReactCompareSliderImage
            src={leftUrl}
            alt="Left comparison"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={rightUrl}
            alt="Right comparison"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        }
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
