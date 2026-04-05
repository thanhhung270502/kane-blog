"use client";

import { cn } from "@tailwind-config/utils/cn";

import { MODAL_DIMENSIONS, SHEET_DIMENSIONS } from "@/shared/constants";
import { useSmaller } from "@/shared/hooks/useBreakpoint";

import { Button } from "../button";
import { Typography } from "../typography";

import type { ConfirmationDialogProps } from "./confirmation-dialog";

export const ConfirmationContent = (props: ConfirmationDialogProps) => {
  const { renderContent, confirmButtonText = "Remove", onConfirm, isLoading } = props;
  const onClose = () => props.setOpen(false);
  const isMobile = useSmaller("sm");

  const defaultContent = (
    <Typography variant="body-lg" color="secondary">
      You are going to delete item. This action can't be undone.
    </Typography>
  );

  return (
    <>
      <div
        className={cn(
          "px-4xl pt-xl pb-4xl gap-2xl flex flex-col",
          isMobile ? SHEET_DIMENSIONS.BASE_FORM : MODAL_DIMENSIONS.BASE_FORM
        )}
      >
        {renderContent ?? defaultContent}
        <div className={cn("gap-lg flex")}>
          <Button type="button" variant="gray" onClick={onClose} disabled={isLoading} fullWidth>
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onConfirm}
            loading={isLoading}
            fullWidth
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </>
  );
};
