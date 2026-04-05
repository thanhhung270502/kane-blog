"use client";

import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";
import Image from "next/image";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  MODAL_DIMENSIONS,
  Typography,
  useSmaller,
} from "@/shared";

import { useSignup } from "../../hooks";

import { SignupForm } from "./signup-form";

const FEATURES = [
  "Multiple Sizes",
  "High Resolution",
  "Won't Damage Walls",
  "Affordable & Free Shipping",
  "UV & Water Resistant",
];

export const SignupDialog = () => {
  const signupMethods = useSignup();
  const { open, setOpen } = signupMethods;
  const isMobile = useSmaller("sm");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn(MODAL_DIMENSIONS.SIGNUP, "overflow-hidden rounded-3xl p-0")}>
        <div className="flex h-full flex-col-reverse overflow-auto sm:grid sm:grid-cols-[632fr_583fr]">
          {/* Illustration panel - 632px */}
          <div className="relative h-full">
            {isMobile ? null : (
              <>
                <Image
                  src="/images/signup-model.svg"
                  alt="Create your Sweet Pix account"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-5xl">
                  <Typography variant="body-xl" color="white" weight="semibold" className="leading-[1.4]">
                    The easiest way to professionally display office staff without wall damage.
                  </Typography>
                  <div className="flex flex-wrap items-center gap-2xl">
                    {FEATURES.map((feature) => (
                      <div key={feature} className="flex items-center gap-md">
                        <CheckIcon size={24} weight="bold" className="text-brand-secondary" />
                        <Typography variant="body-sm" color="white" weight="regular" className="-tracking-wider">
                          {feature}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Form panel - 583px */}
          <div className="flex w-full flex-col bg-white">
            <div className="flex items-center justify-between border-b border-secondary p-[24px]">
              <DialogTitle>Create your account</DialogTitle>
              <DialogClose
                nativeButton={false}
                render={<XIcon size={24} className="cursor-pointer text-neutral-900 outline-0" />}
              />
            </div>
            <SignupForm {...signupMethods} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
