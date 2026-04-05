"use client";

import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { cn } from "@tailwind-config/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const TooltipProvider = BaseTooltip.Provider;

const Tooltip = ({ delay = 200, ...props }: BaseTooltip.Root.Props) => {
  return <BaseTooltip.Root delay={delay} {...props} />;
};

type TooltipTriggerProps = BaseTooltip.Trigger.Props;
const TooltipTrigger = ({ className, ...props }: TooltipTriggerProps) => {
  return (
    <BaseTooltip.Trigger className={cn("focus-visible:outline-hidden", className)} {...props} />
  );
};

const tooltipArrowFillVariants = cva([], {
  variants: {
    variant: {
      light: "fill-white",
      dark: "fill-neutral-950",
    },
  },
  defaultVariants: {
    variant: "light",
  },
});

const tooltipArrowContainerVariants = cva(["flex absolute"], {
  variants: {
    side: {
      top: "-bottom-2 rotate-180",
      bottom: "-top-2",
      left: "right-[-13px] rotate-90",
      right: "left-[-13px] -rotate-90",
    },
  },
  defaultVariants: {
    side: "bottom",
  },
});

type TooltipArrowProps = BaseTooltip.Arrow.Props &
  VariantProps<typeof tooltipArrowFillVariants> &
  VariantProps<typeof tooltipArrowContainerVariants>;
const TooltipArrow = ({
  variant = "light",
  side = "bottom",
  className,
  ...props
}: TooltipArrowProps) => {
  return (
    <BaseTooltip.Arrow
      className={cn(tooltipArrowContainerVariants({ side }), className)}
      {...props}
    >
      <svg
        width="20"
        height="10"
        viewBox="0 0 20 10"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("block")}
      >
        <path
          d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
          className={cn(tooltipArrowFillVariants({ variant }))}
        />
        <path
          d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
          className="fill-neutral-100 dark:fill-transparent"
        />
        <path
          d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
          className="fill-transparent dark:fill-neutral-950"
        />
      </svg>
    </BaseTooltip.Arrow>
  );
};

const tooltipContentVariants = cva(
  [
    "rounded-md shadow-lg p-xl",
    "font-regular body-md",
    "transition duration-150 origin-[var(--transform-origin)] will-change-transform",
    "[&[data-starting-style]]:opacity-0 [&[data-starting-style]]:scale-95",
    "[&[data-ending-style]]:opacity-0 [&[data-ending-style]]:scale-95",
  ],
  {
    variants: {
      variant: {
        light: "bg-white text-secondary",
        dark: "bg-fg-primary text-placeholder-subtle",
      },
    },
    defaultVariants: {
      variant: "light",
    },
  }
);

type TooltipContentProps = BaseTooltip.Positioner.Props &
  VariantProps<typeof tooltipContentVariants> & {
    showArrow?: boolean;
    popupClassName?: string;
  };

const TooltipContent = ({
  className,
  showArrow = false,
  variant = "light",
  children,
  side = "top",
  sideOffset = 8,
  popupClassName,
  ...props
}: TooltipContentProps) => {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        side={side}
        sideOffset={sideOffset}
        className={cn("z-tooltip pointer-events-auto outline-none", className)}
        {...props}
      >
        <BaseTooltip.Popup className={cn(tooltipContentVariants({ variant }), popupClassName)}>
          {children}
          {showArrow && (
            <TooltipArrow
              variant={variant}
              side={(side as "top" | "bottom" | "left" | "right") ?? "bottom"}
            />
          )}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
};

export { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger };
