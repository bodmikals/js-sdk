import * as React from "react";
import { Text } from "../typography/text";

import {
  CaretLeftIcon,
  CaretRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../icon";

import { ButtonProps, buttonVariants } from "../button";
import { cnBase } from "tailwind-variants";
import { Select } from "../select";
import { Flex } from "../flex";
import { useMemo } from "react";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cnBase(
      " oui-flex oui-justify-center oui-text-xs oui-items-center",
      className
    )}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cnBase(
      "oui-flex oui-flex-row oui-items-center oui-gap-2",
      className
    )}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cnBase("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  // size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    data-active={isActive}
    className={buttonVariants({
      size: "xs",
      // color:'white',
      variant: isActive ? "contained" : "text",
      className:
        "oui-min-w-6 oui-text-base-contrast-80 oui-font-semibold data-[active=false]:hover:oui-bg-base-6",
      // size,
    })}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,

  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cnBase("oui-gap-1 oui-pl-2.5", className)}
    {...props}
  >
    <ChevronLeftIcon className="oui-h-4 oui-w-4" color="white" />
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cnBase("oui-gap-1 oui-pr-2.5", className)}
    {...props}
  >
    <ChevronRightIcon className="oui-h-4 oui-w-4" color="white" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cnBase(
      "oui-flex oui-h-9 oui-w-9 oui-items-center oui-justify-center",
      className
    )}
    {...props}
  >
    {/* <DotsHorizontalIcon className="h-4 w-4" /> */}
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export type PaginationProps = {
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSize?: number;
  page: number;
  count: number;
  pageTotal: number;
  className?: string;
  classNames?: {
    pagination?: string;
    paginationContent?: string;
    paginationItem?: string;
    paginationLink?: string;
    paginationPrevious?: string;
    paginationNext?: string;
    paginationEllipsis?: string;
  };
};

const Paginations = (props: PaginationProps) => {
  const {
    classNames,
    className,
    pageTotal: totalPages,
    page: currentPage,
  } = props;

  const pageNumbers = useMemo(() => {
    const pageNumbers = [];
    const ellipsis = "...";

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
        endPage = totalPages;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (startPage > 1) {
        pageNumbers.unshift(ellipsis);
        pageNumbers.unshift(1);
      }

      if (endPage < totalPages) {
        pageNumbers.push(ellipsis);
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  }, [currentPage, totalPages]);

  return (
    <Pagination className={cnBase(classNames?.pagination, className)}>
      <Flex mr={4}>
        <Text
          as="div"
          size="2xs"
          intensity={54}
          className="oui-text-nowrap oui-mr-2"
        >
          Rows per page
        </Text>
        <div className={"oui-w-14"}>
          <Select.options
            options={[
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "20", label: "20" },
            ]}
            value={`${props.pageSize ?? 5}`}
            size="xs"
            onValueChange={(value) => props.onPageSizeChange?.(parseInt(value))}
          />
        </div>
      </Flex>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            // @ts-ignore
            disabled={props.page === 1}
            onClick={(event) => {
              event.preventDefault();
              props.onPageChange?.(props.page - 1);
            }}
          />
        </PaginationItem>
        {pageNumbers.map((page, index) => {
          // if (page === "...") {
          //   return (
          //     <PaginationItem key={page}>
          //       <PaginationEllipsis />
          //     </PaginationItem>
          //   );
          // }
          return (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={page === props.page}
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (page !== "...") {
                    props.onPageChange?.(Number(page));
                  } else {
                    props.onPageChange?.(
                      Number((pageNumbers[index + 1] as number) - 1)
                    );
                  }
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              props.onPageChange?.(props.page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export {
  Paginations,
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
