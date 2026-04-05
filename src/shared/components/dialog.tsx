"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "@tailwind-config/utils/cn";
import { cva } from "class-variance-authority";

const Dialog = BaseDialog.Root;

type DialogContentProps = BaseDialog.Popup.Props & {
  container?: BaseDialog.Portal.Props["container"];
  backdropClassName?: string;
};

const popupVariants = cva([
  "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  "w-94",
  "bg-white shadow-lg z-dialog",
  "transition-all duration-150",
  "data-[ending-style]:scale-90 data-[ending-style]:opacity-0",
  "data-[nested-dialog-open]:after:absolute data-[nested-dialog-open]:after:inset-0",
  "data-[nested-dialog-open]:after:rounded-[inherit] data-[nested-dialog-open]:after:bg-black/20",
  "pointer-events-auto",
]);

const DialogContent = ({
  children,
  className,
  container,
  backdropClassName,
  ...props
}: DialogContentProps) => {
  return (
    <BaseDialog.Portal container={container}>
      <BaseDialog.Backdrop
        className={cn(
          "z-overlay fixed inset-0 bg-black/50 backdrop-blur-[2px]",
          "transition-all duration-150",
          "data-ending-style:opacity-100 data-starting-style:opacity-0",
          backdropClassName
        )}
      />
      <BaseDialog.Popup className={cn(popupVariants(), className)} {...props}>
        <div className="flex h-full max-h-dvh flex-col">{children}</div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
};

type DialogTitleProps = BaseDialog.Title.Props;
const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
  return (
    <BaseDialog.Title
      className={cn("text-neutral-primary body-xl font-semibold", className)}
      {...props}
    />
  );
};

type DialogDescriptionProps = BaseDialog.Description.Props;
const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  return (
    <BaseDialog.Description className={cn("text-neutral-primary body-lg", className)} {...props} />
  );
};

const DialogTrigger = BaseDialog.Trigger;
const DialogClose = BaseDialog.Close;

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger };
