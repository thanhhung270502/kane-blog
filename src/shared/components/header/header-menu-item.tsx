import Link from "next/link";

import { Button } from "../button";

type HeaderMenuItemProps = {
  href?: string;
  onClick?: () => void;
  label: string;
  icon?: React.ReactNode;
};

export const HeaderMenuItem = ({ href, onClick, label, icon }: HeaderMenuItemProps) => {
  const renderButton = (
    <Button
      type="button"
      variant="no-outlined-primary"
      onClick={onClick}
      className="hover:bg-success px-2xl py-xl gap-2xl! font-regular! w-full cursor-pointer justify-start rounded-sm hover:text-white"
      startIcon={icon}
    >
      {label}
    </Button>
  );
  if (href) {
    return <Link href={href}>{renderButton}</Link>;
  }
  return renderButton;
};
