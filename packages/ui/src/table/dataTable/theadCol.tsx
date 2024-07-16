import { CSSProperties, ReactNode, useContext } from "react";
import { ColProps } from "./col";
import { withFixedStyle } from "./colHOC";

import { TableContext } from "./tableContext";
import { cnBase } from "tailwind-variants";
import { SortingAscIcon, SortingDescIcon, SortingIcon } from "../../icon";

const TheadColItem = (
  props: ColProps & {
    style?: CSSProperties;
    className?: string;
    bordered?: boolean;
  }
) => {
  const { col: column, index } = props;
  const { sortKey, sortOrder, onSort } = useContext(TableContext);
  let content: ReactNode = column.title;

  if (!!column.hint || !!column.onSort) {
    content = (
      <button
        className={cnBase(
          "hover:oui-text-base-contrast oui-inline-flex oui-gap-1 oui-items-center",
          sortKey === column.dataIndex && "oui-text-base-contrast"
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (!column.onSort) {
            return;
          }
          onSort(column.dataIndex);
        }}
      >
        <span>{column.title}</span>

        {column.onSort &&
          (sortKey === column.dataIndex ? (
            sortOrder === "asc" ? (
              <SortingAscIcon size={14} color={"white"} />
            ) : (
              <SortingDescIcon size={14} color={"white"} />
            )
          ) : (
            <SortingIcon size={14} color={"white"} />
          ))}

        {/*/!* sort indicator *!/*/}
        {/*<CaretDownIcon*/}
        {/*  className={cnBase(*/}
        {/*    "oui-transition-all oui-duration-200 oui-hidden",*/}
        {/*    sortKey === column.dataIndex && "oui-block",*/}
        {/*    sortOrder === "asc" && "oui-rotate-180",*/}
        {/*    sortOrder === "desc" && "oui-rotate-0"*/}
        {/*  )}*/}
        {/*  size={10}*/}
        {/*/>*/}
      </button>
    );
  }

  // if (!!column.hint) {
  //   if (typeof column.hint === "string") {
  //     content = (
  //       <Tooltip
  //         content={column.hint}
  //         className={cn(
  //           "oui-max-w-[270px] oui-text-4xs",
  //           column.hintClassName && column.hintClassName
  //         )}
  //       >
  //         {content}
  //       </Tooltip>
  //     );
  //   } else {
  //     content = (
  //       <HoverCard
  //         // @ts-ignore
  //         content={column.hint}
  //         side="top"
  //         align="center"
  //         className={cn(
  //           "oui-max-w-[270px] oui-text-4xs",
  //           column.hintClassName && column.hintClassName
  //         )}
  //       >
  //         {content}
  //       </HoverCard>
  //     );
  //   }
  // }

  return (
    <td
      className={cnBase(
        "oui-px-1 oui-py-[3px] oui-h-10",
        column.align === "right" && "oui-text-right",
        column.align === "center" && "oui-text-center",
        props.justified && "first:oui-pl-0 last:oui-pr-0",
        props.bordered && "oui-border-b oui-border-line",
        column.fixed && "oui-sticky",
        props.className
      )}
      key={column.dataIndex}
      style={props.style}
    >
      {content}
    </td>
  );
};

export const TheadCol =
  withFixedStyle<{ className?: string; bordered?: boolean }>(TheadColItem);
