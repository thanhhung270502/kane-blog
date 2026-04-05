import { cn } from "@tailwind-config/utils/cn";

const MAX_WIDTH = "max-w-[550px]";

type CenterCardProps = {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
};

export const CenterCard = ({ children, className, wrapperClassName }: CenterCardProps) => {
  return (
    <div
      className={cn(
        "p-4xl bg-gradient-brand-secondary flex min-h-screen items-center justify-center",
        wrapperClassName
      )}
    >
      <div className={cn("p-6xl w-full rounded-lg bg-white shadow-md", MAX_WIDTH, className)}>
        {children}
      </div>
    </div>
  );
};
