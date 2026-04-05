"use client";

import { useEffect, useState } from "react";
import { cn } from "@tailwind-config/utils/cn";
import Image from "next/image";
import Link from "next/link";

import { Button, useAuthRequest, useQueryMe } from "@/shared";

import { HeaderMenu } from "./header-menu";

type HeaderProps = {
  isLandingPage?: boolean;
};

export const Header = ({ isLandingPage = false }: HeaderProps) => {
  const { onOpenLogin } = useAuthRequest();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: user, isFetching } = useQueryMe();
  const isAuthenticated = !!user && !isFetching;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "border-secondary relative top-0 right-0 left-0 z-50 border-b transition-all duration-300",
        isLandingPage ? "fixed border-transparent" : "relative",
        isLandingPage && isScrolled && "border-secondary bg-white"
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Menu */}
        <div className="flex w-1/3 items-center">
          <HeaderMenu isLandingPage={isLandingPage} isScrolled={isScrolled} />
        </div>

        {/* Logo */}
        <div className="flex w-1/3 items-center justify-center">
          <Link href="/">
            <Image
              src={
                !isLandingPage || isScrolled ? "/images/logo-dark.svg" : "/images/logo-light.svg"
              }
              alt="Sweetpix"
              width={140}
              height={36}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Actions */}
        <div className="flex w-1/3 items-center justify-end gap-8">
          {!isAuthenticated && (
            <Button
              type="button"
              variant="no-outlined-primary"
              size="md"
              onClick={onOpenLogin}
              rounded
              className={cn("text-white", (!isLandingPage || isScrolled) && "text-black")}
            >
              Login
            </Button>
          )}
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
            <Link href="/account" onClick={() => setMenuOpen(false)}>
              <Button variant="outlined-primary" size="md" fullWidth>
                My account
              </Button>
            </Link>
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
