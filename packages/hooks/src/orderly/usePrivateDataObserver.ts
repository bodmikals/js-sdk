import { useEffect, useRef } from "react";
import { useWS } from "../useWS";
import { mutate } from "swr";
import { WSMessage, API } from "@orderly.network/types";
import { useAccount } from "../useAccount";
import { unstable_serialize } from "swr/infinite";
import { useDebouncedCallback } from "use-debounce";
import { useEventEmitter } from "../useEventEmitter";
import { getKeyFunction } from "../dataProvider";
import { parseJSON } from "../utils/json";
import { updateOrdersHandler, updateAlgoOrdersHandler } from "../utils/swr";
import { AlgoOrderMergeHandler } from "../services/orderMerge/algoOrderMergeHandler";
import { object2underscore } from "../utils/ws";
import { useLocalStorage } from "../useLocalStorage";

export const usePrivateDataObserver = (options: {
  // onUpdateOrders: (data: any) => void;
  getKeysMap: (type: string) => Map<string, getKeyFunction>;
}) => {
  const ws = useWS();
  // const { mutate } = useSWRConfig();
  const ee = useEventEmitter();
  const { state } = useAccount();

  // TODO: remove this when the WS service provides the correct data
  // const algoOrderCacheQuneue = useRef<API.AlgoOrder[]>([]);

  const [subOrder, setSubOrder] = useLocalStorage("orderly_subscribe_order", true);

  const updateOrders = (
    data: WSMessage.AlgoOrder[] | WSMessage.Order,
    isAlgoOrder: boolean
  ) => {
    const keysMap = options.getKeysMap("orders");

    keysMap.forEach((getKey, key) => {
      mutate(
        unstable_serialize((index, prevData) => [
          getKey(index, prevData),
          state.accountId,
        ]),
        (prevData?: any[]) => {
          try {
            if (isAlgoOrder) {
              const result = updateAlgoOrdersHandler(
                key,
                data as WSMessage.AlgoOrder[],
                prevData!
              );

              return result;
            }
            return updateOrdersHandler(key, data as WSMessage.Order, prevData);
          } catch (error) {
            return prevData;
          }
        },
        {
          revalidate: false,
        }
      );
    });

    //  emit events;
    // ee.emit("orders:changed", {
    //   ...data,
    //   status: data.status || (data as WSMessage.AlgoOrder).algoStatus,
    // });

    const formattedData = isAlgoOrder
      ? AlgoOrderMergeHandler.groupOrders(data as WSMessage.AlgoOrder[])
      : object2underscore(data);

    ee.emit("orders:changed", {
      ...formattedData,
      status: isAlgoOrder
        ? formattedData.algo_status
        : (data as WSMessage.Order).status,
    });
  };

  // orders
  useEffect(() => {
    if (!state.accountId) return;
    if (subOrder !== true) return;
    const unsubscribe = ws.privateSubscribe("executionreport", {
      onMessage: (data: any) => {
        updateOrders(data, false);
      },
    });

    return () => unsubscribe?.();
  }, [state.accountId, subOrder]);

  // algo orders
  useEffect(() => {
    if (!state.accountId) return;
    if (subOrder !== true) return;
    const unsubscribe = ws.privateSubscribe("algoexecutionreport", {
      onMessage: (data: any) => {
        updateOrders(data, true);
      },
    });

    return () => unsubscribe?.();
  }, [state.accountId, subOrder]);

  // positions
  useEffect(() => {
    if (!state.accountId) return;
    const key = ["/v1/positions", state.accountId];
    const unsubscribe = ws.privateSubscribe("position", {
      onMessage: (data: { positions: WSMessage.Position[] }) => {
        const { positions: nextPostions } = data;

        // console.log("ws----- positions data-----", data);

        // updatePositions();

        mutate(
          key,
          (prevPositions: any) => {
            // return nextPostions;
            if (!!prevPositions) {
              return {
                ...prevPositions,
                rows: prevPositions.rows.map((row: any) => {
                  const item = nextPostions.find(
                    (item) => item.symbol === row.symbol
                  );
                  if (item) {
                    return {
                      symbol: item.symbol,
                      position_qty: item.positionQty,
                      cost_position: item.costPosition,
                      last_sum_unitary_funding: item.lastSumUnitaryFunding,
                      pending_long_qty: item.pendingLongQty,
                      pending_short_qty: item.pendingShortQty,
                      settle_price: item.settlePrice,
                      average_open_price: item.averageOpenPrice,
                      unsettled_pnl: item.unsettledPnl,
                      mark_price: item.markPrice,
                      est_liq_price: item.estLiqPrice,
                      timestamp: Date.now(),
                      imr: item.imr,
                      mmr: item.mmr,
                      IMR_withdraw_orders: item.imrwithOrders,
                      MMR_with_orders: item.mmrwithOrders,
                      pnl_24_h: item.pnl24H,
                      fee_24_h: item.fee24H,
                    };
                  }

                  return row;
                }),
              };
            }
          },
          {
            revalidate: false,
          }
        );
      },
    });
    return () => {
      unsubscribe?.();
    };
  }, [state.accountId]);

  // cache algo orders
  // useEffect(() => {
  //   const handler = (data: API.AlgoOrder) => {
  //     algoOrderCacheQuneue.current.push(data);
  //   };

  //   ee.on("algoOrder:cache", handler);

  //   return () => {
  //     ee.off("algoOrder:cache", handler);
  //   };
  // }, []);
};
