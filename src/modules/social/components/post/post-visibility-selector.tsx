import { useState } from "react";
import React from "react";
import { EPostVisibility } from "@common";
import { CaretDownIcon, GlobeIcon, UserIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@/shared";

type PostVisibilitySelectorProps = {
  visibility: EPostVisibility;
  setVisibility: (visibility: EPostVisibility) => void;
};

export const PostVisibilitySelector = ({
  visibility,
  setVisibility,
}: PostVisibilitySelectorProps) => {
  const [open, setOpen] = useState(false);
  const options = [
    { label: "Public", value: EPostVisibility.PUBLIC, icon: <GlobeIcon /> },
    { label: "Friends", value: EPostVisibility.FRIENDS, icon: <UserIcon /> },
  ];

  const selectedOption = options.find((option) => option.value === visibility);

  const handleChange = (value: EPostVisibility) => () => {
    setVisibility(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            size="sm"
            variant="black-quaternary"
            startIcon={
              selectedOption?.icon
                ? React.cloneElement(selectedOption.icon, { size: 14, weight: "fill" })
                : undefined
            }
            className="px-sm! py-xs! text-xs! font-medium!"
            endIcon={<CaretDownIcon weight="fill" />}
          >
            {selectedOption?.label}
          </Button>
        }
      />
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={8}
        popupClassName="flex flex-col bg-black-tertiary rounded-sm shadow-xs w-48 py-md"
      >
        {options.map((option) => (
          <button
            key={option.value}
            className={cn(
              "gap-sm px-xl py-xs flex cursor-pointer items-center text-sm font-medium",
              "hover:bg-black-quaternary"
            )}
            onClick={handleChange(option.value)}
          >
            {React.cloneElement(option.icon, { size: 14, weight: "fill" })}
            {option.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
