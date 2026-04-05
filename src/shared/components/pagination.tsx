"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";

import { Button } from "./button";
import { Select } from "./select";
import { Separator } from "./separator";

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onChangePage: (page: number) => void;
  onChangePageSize: (size: number) => void;
  wrapperClassName?: string;
}

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const baseWrapperClassNames = "bg-white py-2xl px-md";

export function Pagination({
  pageIndex,
  pageSize,
  totalItems,
  onChangePage,
  onChangePageSize,
  wrapperClassName,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const pageStart = totalItems > 0 ? pageIndex * pageSize + 1 : 0;
  const pageEnd = Math.min((pageIndex + 1) * pageSize, totalItems);

  const canGoPrevious = pageIndex > 0;
  const canGoNext = pageIndex < totalPages - 1;

  const selectedPageSizeOption =
    PAGE_SIZE_OPTIONS.find((option) => option.value === pageSize) || PAGE_SIZE_OPTIONS[0];

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      onChangePage(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      onChangePage(pageIndex + 1);
    }
  };

  return (
    <div className={cn(baseWrapperClassNames, wrapperClassName)}>
      <div className="gap-xl flex w-full flex-col items-end justify-center md:flex-row">
        <Select
          value={selectedPageSizeOption}
          onChange={(option) => {
            if (option && "value" in option) {
              onChangePageSize(Number(option.value));
            }
          }}
          options={PAGE_SIZE_OPTIONS}
          placeholder="Rows per page"
          formatOptionLabel={(option) => (
            <span className="text-primary body-md font-medium">
              {option.value} <span className="text-quaternary font-regular"> per page</span>
            </span>
          )}
          size="sm"
          className="min-w-37.5"
          menuPosition="fixed"
        />

        <div className="border-primary flex w-fit items-center rounded-4xl border border-solid">
          <div className="pl-2xl py-md pr-md">
            <span className="text-primary body-md font-medium">
              {pageStart}-{pageEnd}{" "}
              <span className="text-quaternary font-regular"> of {totalItems}</span>
            </span>
          </div>

          <Separator orientation="vertical" />

          <div className="flex items-center">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
              iconOnly
              startIcon={ArrowLeftIcon}
              className="hover:bg-brand-primary-alt border-0 bg-transparent text-black"
              aria-label="Previous page"
            />

            <Button
              variant="primary"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext}
              iconOnly
              endIcon={ArrowRightIcon}
              className="hover:bg-brand-primary-alt border-0 bg-transparent text-black"
              aria-label="Next page"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
