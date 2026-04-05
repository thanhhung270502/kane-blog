"use client";

import { useState } from "react";
import {
  CameraIcon,
  HouseIcon,
  ListIcon,
  SignOutIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";
import Image from "next/image";
import Link from "next/link";

import { useLogout } from "@/modules/auth/hooks";
import { MODAL_DIMENSIONS, SHEET_DIMENSIONS } from "@/shared/constants/layout.constant";
import { useQueryMe, useSmaller } from "@/shared/hooks";

import { Button } from "../button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../sheet";
import { Separator, Typography } from "..";

import { HeaderMenuItem } from "./header-menu-item";

type HeaderMenuProps = {
  isLandingPage?: boolean;
  isScrolled?: boolean;
};

export const HeaderMenu = ({ isLandingPage = false, isScrolled = false }: HeaderMenuProps) => {
  const isMobile = useSmaller("sm");
  const [open, setOpen] = useState(false);
  const { data: user } = useQueryMe();
  const { logout, isLoggingOut } = useLogout();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="no-outlined-primary"
          size="md"
          startIcon={
            <ListIcon
              size={24}
              className={cn("text-white", (!isLandingPage || isScrolled) && "text-black")}
            />
          }
          iconOnly
          className={cn("text-white", (!isLandingPage || isScrolled) && "text-black")}
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn("gap-0 overflow-x-hidden overflow-y-auto rounded-r-2xl bg-white")}
        showOverlay
      >
        <SheetHeader className="pl-4xl pr-2xl py-2xl border-secondary flex flex-row items-center justify-between border-b">
          <Link href="/">
            <Image
              src="/images/logo-dark.svg"
              alt="Sweetpix"
              width={140}
              height={36}
              className="h-10 w-auto"
            />
          </Link>
          <SheetClose asChild>
            <Button variant="no-outlined-primary" size="md" startIcon={XIcon} iconOnly />
          </SheetClose>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Menu</SheetDescription>
        </SheetHeader>

        <div
          className={cn(
            "px-sm gap-sm flex flex-col overflow-y-auto",
            isMobile ? SHEET_DIMENSIONS.BASE_FORM : MODAL_DIMENSIONS.BASE_FORM
          )}
        >
          {user && (
            <div className="p-2xl gap-sm flex flex-col">
              <div className="flex flex-col">
                <Typography variant="body-md" weight="medium">
                  {user.name}
                </Typography>
                <Typography variant="body-md">{user.email}</Typography>
              </div>
              {/* Logout button */}
              <Button
                variant="primary"
                size="sm"
                startIcon={SignOutIcon}
                onClick={logout}
                loading={isLoggingOut}
                className="mt-sm w-fit rounded-full"
              >
                Log out
              </Button>
            </div>
          )}
          <Separator />
          <HeaderMenuItem href="/" label="Home" icon={<HouseIcon weight="fill" size={24} />} />
          <HeaderMenuItem
            href="/account"
            label="My Account"
            icon={<UserIcon weight="fill" size={24} />}
          />
          <HeaderMenuItem
            href="/studio"
            label="Your Frame Photos"
            icon={<CameraIcon weight="fill" size={24} />}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
