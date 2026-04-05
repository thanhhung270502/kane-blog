"use client";

import { XIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";

import { Dialog, DialogClose, DialogContent, DialogTitle, MODAL_DIMENSIONS } from "@/shared";

import { useLogin } from "../../hooks";
import { LoginForm } from "..";

export const LoginDialog = () => {
  const loginMethods = useLogin();
  const { open, setOpen } = loginMethods;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn(MODAL_DIMENSIONS.LOGIN, "rounded-3xl p-0")}>
        <div className="flex items-center justify-between border-b border-secondary p-[24px]">
          <DialogTitle className="max-w-[325px] leading-[1.33]">
            Welcome back to SweetPix Sign in below
          </DialogTitle>
          <DialogClose
            nativeButton={false}
            render={<XIcon size={24} className="cursor-pointer text-neutral-900 outline-0" />}
          />
        </div>
        <LoginForm {...loginMethods} />
      </DialogContent>
    </Dialog>
  );
};
