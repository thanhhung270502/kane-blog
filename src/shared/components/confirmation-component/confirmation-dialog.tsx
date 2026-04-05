"use client";

import { TrashIcon, XIcon } from "@phosphor-icons/react";

import { Button } from "../button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

import { ConfirmationContent } from "./confirmation-content";

export type ConfirmationDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  renderTrigger?: React.ReactElement;
  renderContent?: React.ReactNode;
  onConfirm?: () => void;
  isLoading?: boolean;
  isShowTrigger?: boolean;
  confirmButtonText?: string;
};

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const { open, setOpen, title = "Are you sure?", renderTrigger, isShowTrigger = true } = props;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isShowTrigger ? (
        <DialogTrigger
          render={
            renderTrigger ?? (
              <Button
                variant="outlined-secondary"
                iconOnly
                startIcon={TrashIcon}
                className="p-sm!"
              />
            )
          }
        />
      ) : null}
      <DialogContent>
        <div className="py-xl px-4xl flex items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <DialogClose
            nativeButton={false}
            render={<XIcon size={20} className="text-quaternary cursor-pointer outline-0" />}
          />
        </div>
        <DialogDescription className="sr-only">{title}</DialogDescription>
        <ConfirmationContent {...props} />
      </DialogContent>
    </Dialog>
  );
};
