import React, { useCallback, useContext, useEffect } from "react";
import { PositionHeader } from "./positionHeader";
import { PositionsView } from "@/block/positions";
import { usePositionStream, useSessionStorage } from "@orderly.network/hooks";
import { modal } from "@/modal";
import { ClosePositionPane } from "@/block/positions/sections/closeForm";
import {
  API,
  AccountStatusEnum,
  OrderEntity,
  OrderSide,
  OrderType,
} from "@orderly.network/types";
import { LimitConfirm } from "@/block/positions/sections/limitConfirm";
import { MarkPriceConfirm } from "@/block/positions/sections/markPriceConfirm";
import { PositionLimitCloseDialog } from "@/block/positions/sections/closeDialog";
import { useMutation, useAccount } from "@orderly.network/hooks";
import { TradingPageContext } from "@/page";
import { toast } from "@/toast";
import { TabContext } from "@/tab";

export const PositionPane = () => {
  const context = useContext(TradingPageContext);
  const tabContext = useContext(TabContext);

  // console.log("********", data, info.maintenance_margin_ratio());

  const [showAllSymbol, setShowAllSymbol] = useSessionStorage(
    "showAllSymbol_position",
    true
  );

  const [symbol, setSymbol] = React.useState(() =>
    showAllSymbol ? "" : context.symbol
  );

  const onShowAllSymbolChange = (isAll: boolean) => {
    setSymbol(isAll ? "" : context.symbol);
    setShowAllSymbol(isAll);
  };

  const [data, info, { loading }] = usePositionStream(symbol);
  const { state } = useAccount();

  const [postOrder] = useMutation<OrderEntity, any>("/v1/order");

  const onLimitClose = useCallback(async (position: API.Position) => {
    return modal
      .sheet({
        title: "Limit Close",
        content: (
          <PositionLimitCloseDialog
            positions={position}
            side={position.position_qty > 0 ? OrderSide.SELL : OrderSide.BUY}
          />
        ),
      })
      .then(() => {})
      .catch((e) => {
        console.log("cancel");
      });
  }, []);

  const onMarketClose = useCallback(async (position: API.Position) => {
    return modal
      .confirm({
        title: "Market Close",
        content: <MarkPriceConfirm position={position} />,
        onCancel: () => {
          return Promise.reject();
        },
        onOk: () => {
          return postOrder({
            symbol: position.symbol,
            side: position.position_qty > 0 ? OrderSide.SELL : OrderSide.BUY,
            order_type: OrderType.MARKET,
            order_quantity: Math.abs(position.position_qty),
          })
            .then((res: any) => {
              // console.log("postOrder", res);
              toast.success("success");
            })
            .catch((err: Error) => {
              // console.log("postOrder", e);
              toast.error(err.message);
            });
        },
      })
      .catch(() => {
        console.log("cancel");
      });
  }, []);

  return (
    <PositionsView
      dataSource={
        state.status < AccountStatusEnum.EnableTrading ? [] : data.rows
      }
      aggregated={data.aggregated}
      isLoading={loading}
      onLimitClose={onLimitClose}
      onMarketClose={onMarketClose}
      showAllSymbol={showAllSymbol}
      onShowAllSymbolChange={onShowAllSymbolChange}
    />
  );
};
