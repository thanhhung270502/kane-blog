import { cn } from "@tailwind-config/utils/cn";
import Image from "next/image";

import { LOADING_LOCATION_WIDTH } from "../constants";

import { LinearProgress } from "./linear-progress";
import { Typography } from "./typography";

type LoadingScreenProps = {
  text?: string;
};

export const LoadingScreen = ({ text }: LoadingScreenProps) => {
  return (
    <div className="flex size-full items-center justify-center bg-white/60">
      <div
        className={cn(
          "gap-2xl p-6xl flex flex-col items-center justify-center rounded-lg bg-white/80 shadow-lg",
          LOADING_LOCATION_WIDTH
        )}
      >
        <Image
          src="/images/logo-icon.svg"
          alt="Logo"
          width={50}
          height={50}
          className="animate-bounce"
        />
        {text && (
          <Typography variant="body-md" weight="medium" className="text-success animate-bounce">
            {text}
          </Typography>
        )}
        <LinearProgress
          value={0}
          indeterminate
          className={cn("bg-success-alt h-1.5!")}
          progressClassName={cn("h-1.5!", "bg-success")}
        />
      </div>
    </div>
  );
};
