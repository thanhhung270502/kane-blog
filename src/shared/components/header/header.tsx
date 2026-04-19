"use client";

import { useState } from "react";
import { HouseIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";
import Image from "next/image";
import Link from "next/link";

import { AccountButton, Button, Input, useAuthRequest, useQueryMe } from "@/shared";

import { NotificationButton } from "./notification-button";

export const Header = () => {
  const { onOpenLogin } = useAuthRequest();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: user, isFetching } = useQueryMe();
  const isAuthenticated = !!user && !isFetching;
  const [search, setSearch] = useState("");

  return (
    <header
      className={cn(
        "border-black-quaternary bg-black-secondary sticky top-0 right-0 left-0 z-50 border-b transition-all duration-300"
      )}
    >
      <div className="py-md flex h-16 items-center justify-between px-6">
        {/* Menu */}
        <div className="gap-md flex w-1/3 items-center">
          <div className="bg-black-quaternary px-sm py-xs flex items-center justify-center overflow-hidden rounded-xl">
            <Image src="/images/kw-logo.png" alt="Sweetpix" width={36} height={36} />
          </div>
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leadingIcon={MagnifyingGlassIcon}
            inputWrapperClassName="bg-black-tertiary border-0 rounded-full text-white-primary"
            className="text-white-primary"
          />
        </div>

        {/* Logo */}
        <div className="flex w-1/3 items-center justify-center">
          <Link href="/">
            <Button
              variant="no-outlined-primary"
              size="md"
              startIcon={<HouseIcon size={24} weight="fill" />}
            />
          </Link>
        </div>

        {/* Actions */}
        <div className="flex w-1/3 items-center justify-end gap-2">
          <NotificationButton />
          <AccountButton />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute top-16 right-0 left-0 border-t border-b border-neutral-200 bg-white transition-all duration-300 md:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div className="flex flex-col gap-4 px-4 py-6">
          {isAuthenticated ? (
            // <Link href="/account" onClick={() => setMenuOpen(false)}>
            //   <Button variant="outlined-primary" size="md" fullWidth>
            //     My account
            //   </Button>
            // </Link>
            <AccountButton />
          ) : (
            <button
              onClick={() => {
                onOpenLogin();
                setMenuOpen(false);
              }}
              className="body-md text-center font-medium text-black"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setMenuOpen(false)}
            className="bg-brand-secondary body-md w-full rounded-full py-1.5 text-center font-medium text-white transition-all active:scale-95"
          >
            Shop Now
          </button>
        </div>
      </div>
    </header>
  );
};
