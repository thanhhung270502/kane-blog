import { formatDate, Tooltip, TooltipContent, TooltipTrigger, Typography } from "@/shared";

const DATE_FORMAT_SHORT = "MMM DD, YYYY";
const DATE_FORMAT_LONG = "MM/DD/YYYY [at] h:mm A";

type DateAtRendererProps = {
  date?: Date;
};

export const DateAtRenderer = ({ date }: DateAtRendererProps) => {
  if (!date) return <Typography variant="body-md">--</Typography>;
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Typography as="span" variant="body-md">
            {formatDate(date, DATE_FORMAT_SHORT) || "--"}
          </Typography>
        }
      />
      <TooltipContent>
        <Typography as="span" variant="body-md">
          {formatDate(date, DATE_FORMAT_LONG) || "--"}
        </Typography>
      </TooltipContent>
    </Tooltip>
  );
};
