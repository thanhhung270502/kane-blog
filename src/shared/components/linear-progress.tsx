"use client";

import { Progress } from "@base-ui/react/progress";
import { cn } from "@tailwind-config/utils/cn";

interface LinearProgressProps {
  value?: number;
  className?: string;
  progressClassName?: string;
  trackClassName?: string;
  indeterminate?: boolean;
}

export const LinearProgress = ({
  value = 0,
  className,
  progressClassName,
  trackClassName,
  indeterminate = false,
}: LinearProgressProps) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <Progress.Root
      value={indeterminate ? null : clampedValue}
      className={cn("relative h-2 w-full overflow-hidden rounded-full", className)}
    >
      <Progress.Track className={cn("bg-brand-primary/10 absolute inset-0", trackClassName)}>
        <Progress.Indicator
          className={cn(
            "bg-brand-main h-full transition-all duration-300 ease-in-out",
            {
              "animate-in slide-in-from-left slide-out-to-right repeat-infinite animation-duration-1500 w-full":
                indeterminate,
            },
            progressClassName
          )}
        />
      </Progress.Track>
    </Progress.Root>
  );
};

LinearProgress.displayName = "LinearProgress";

export type { LinearProgressProps };
