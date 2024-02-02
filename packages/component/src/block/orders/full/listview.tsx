import { FC, useMemo } from "react";
import { Column, Table } from "@/table";
import { Numeral, Text } from "@/text";
import { OrderStatus, OrderSide, API } from "@orderly.network/types";
import Button from "@/button";
import { cx } from "class-variance-authority";
import { upperCaseFirstLetter } from "@/utils/string";
import { SymbolProvider } from "@/provider";
import { NumeralWithCtx } from "@/text/numeralWithCtx";
import { CancelButton } from "./cancelButton";
import { OrderQuantity } from "./quantity";
import { Price } from "./price";
import { EndReachedBox } from "@/listView/endReachedBox";
import { cn } from "@/utils/css";
import { Renew } from "@/block/orderHistory/full/renew";
import { columnsBasis } from "../columnsUtil";
import { OrderTrades } from "@/block/orderHistory/orderTrades";
import { TriggerPrice } from "./triggerPrice";

interface Props {
  dataSource: any[];
  status: OrderStatus;
  onCancelOrder?: (orderId: number, symbol: string) => Promise<any>;
  loading?: boolean;
  loadMore?: () => void;
  className?: string;
}
export const Listview: FC<Props> = (props) => {
  const columns = useMemo<Column<API.Order>[]>(() => {
    // const columns = columnsBasis();

    if (props.status === OrderStatus.INCOMPLETE) {
      const columns: Column<API.Order>[] = [
        {
          title: "Instrument",
          dataIndex: "symbol",
          className: "orderly-h-[48px]",
          width: 120,
          onSort:
            props.status === OrderStatus.INCOMPLETE
              ? (r1, r2, sortOrder) => {
                  if (sortOrder === "asc") {
                    return r1.symbol.localeCompare(r2.symbol);
                  }
                  return r2.symbol.localeCompare(r1.symbol);
                }
              : undefined,
          render: (value: string) => (
            <Text rule={"symbol"} className="orderly-font-semibold">
              {value}
            </Text>
          ),
        },
        {
          title: "Type",
          width: 100,
          className: "orderly-h-[48px] orderly-font-semibold",
          dataIndex: "type",
          formatter: (value: string, record: any) => {
            if (record.algo_order_id) {
              return `Stop ` + `${record.type}`.toLowerCase();
            }
            return upperCaseFirstLetter(value);
          },
        },
        {
          title: "Side",
          width: 100,
          className: "orderly-h-[48px]",
          dataIndex: "side",
          onSort:
            props.status === OrderStatus.INCOMPLETE
              ? (r1, r2, sortOrder) => {
                  if (sortOrder === "asc") {
                    return r2.side.localeCompare(r1.side);
                  }
                  return r1.side.localeCompare(r2.side);
                }
              : undefined,
          render: (value: string) => (
            <span
              className={cx(
                "orderly-font-semibold",
                value === OrderSide.BUY
                  ? "orderly-text-trade-profit"
                  : "orderly-text-trade-loss"
              )}
            >
              {upperCaseFirstLetter(value)}
            </span>
          ),
        },
        {
          title: "Filled / Quantity",
          className: "orderly-h-[48px]",
          dataIndex: "quantity",
          width: 180,
          onSort: props.status === OrderStatus.INCOMPLETE,
          render: (value: string, record: any) => (
            <OrderQuantity order={record} />
          ),
        },
        {
          title: "Price",
          className: "orderly-h-[48px]",
          dataIndex: "price",
          width: 120,
          onSort: props.status === OrderStatus.INCOMPLETE,
          render: (value: string, record: any) => <Price order={record} />,
        },
        {
          title: "Est. total",
          width: 100,
          className: "orderly-h-[48px] orderly-font-semibold",
          dataIndex: "executed",
          render: (value: string, record: any) => {
            return (
              <Numeral
                className={
                  "orderly-font-semibold orderly-text-2xs orderly-text-base-contrast-80"
                }
                precision={2}
              >
                {record.quantity === 0 ||
                Number.isNaN(record.price) ||
                record.price === null
                  ? "--"
                  : `${record.quantity * record.price}`}
              </Numeral>
            );
          },
        },
        {
          title: "Trigger",
          className: "orderly-h-[48px]",
          dataIndex: "trigger_price",
          width: 150,
          // onSort: props.status === OrderStatus.INCOMPLETE,
          render: (value: string, record: any) => (
            <TriggerPrice order={record} />
          ),
        },
        // {
        //   title: "Est. total",
        //   className: "orderly-h-[48px]",
        //   dataIndex: "total",
        // },
        {
          title: "Reduce",
          dataIndex: "reduce_only",
          width: 100,
          className: "orderly-h-[48px] orderly-font-semibold",
          render: (value: boolean) => {
            return <span>{value ? "Yes" : "No"}</span>;
          },
        },
        {
          title: "Hidden",
          dataIndex: "visible",
          width: 100,
          className: "orderly-h-[48px] orderly-font-semibold",
          render: (value: number, record) => {
            return <span>{value === record.quantity ? "No" : "Yes"}</span>;
          },
        },
        {
          title: "Update",
          dataIndex: "updated_time",
          width: 150,
          onSort: props.status === OrderStatus.INCOMPLETE,
          className: "orderly-h-[48px]",
          render: (value: string) => (
            <Text
              rule={"date"}
              className="orderly-break-normal orderly-whitespace-nowrap orderly-font-semibold"
            >
              {value}
            </Text>
          ),
        },
        {
          title: "",
          dataIndex: "action",
          className: "orderly-h-[48px]",
          align: "right",
          fixed: "right",
          width: 100,
          render: (_: string, record) => {
            if (props.status === OrderStatus.INCOMPLETE) {
              return <CancelButton order={record} />;
            }
            return null;
          },
        },
      ];

      // columns.push();

      return columns;
    } else {
      return columnsBasis(props.status);
    }
  }, [props.status]);
  return (
    <EndReachedBox
      onEndReached={() => {
        if (!props.loading) {
          props.loadMore?.();
        }
      }}
    >
      <Table<API.Order>
        bordered
        justified
        columns={columns}
        dataSource={props.dataSource}
        headerClassName="orderly-text-2xs orderly-text-base-contrast-54 orderly-py-3 orderly-bg-base-900"
        className={cn(
          "orderly-text-2xs orderly-text-base-contrast-80",
          props.className
        )}
        generatedRowKey={(record, index) =>
          `${index}${record.order_id || record.algo_order_id}`
        }
        renderRowContainer={(record, index, children) => {
          return (
            <SymbolProvider
              key={index}
              symbol={record.symbol}
              children={children}
            />
          );
        }}
        expandRowRender={
          props.status === "FILLED"
            ? (record: any, index: number) => {
                return <OrderTrades record={record} index={index} />;
              }
            : undefined
        }
      />
    </EndReachedBox>
  );
};
