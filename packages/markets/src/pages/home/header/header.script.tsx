import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Decimal } from "@orderly.network/utils";
import {
  useMarketsStream,
  useSymbolsInfo,
  useQuery,
} from "@orderly.network/hooks";
import { sortList, useSize } from "../../../utils";

// export type EmblaCarouselType = Exclude<UseEmblaCarouselType[1], undefined>;
// export type TEmblaApi = Pick<EmblaCarouselType, "scrollPrev" | "scrollNext">;
// use UseEmblaCarouselType will bring type error
export type TEmblaApi = {
  scrollPrev: (jump?: boolean) => void;
  scrollNext: (jump?: boolean) => void;
};

export type HeaderReturns = ReturnType<typeof useMarketsHeaderScript>;

export const useMarketsHeaderScript = () => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const data = useDataSource();

  const { width } = useSize();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    // duration: 25,
    slidesToScroll: "auto",
  });

  useEffect(() => {
    emblaApi?.on("select", () => {
      setScrollIndex(emblaApi?.selectedScrollSnap());
    });
  }, [emblaApi]);

  return {
    scrollIndex,
    setScrollIndex,
    emblaRef,
    emblaApi: emblaApi as TEmblaApi,
    enableScroll: width < 1440,
    ...data,
  };
};

export function useDataSource() {
  const symbolsInfo = useSymbolsInfo();
  const { data: futures } = useMarketsStream();
  const { data: balance } = useQuery("/v1/public/balance/stats");

  const markets = useMemo(() => {
    const list = futures?.map((item: any) => {
      const { open_interest = 0, index_price = 0 } = item;
      const info = symbolsInfo[item.symbol];

      return {
        ...item,
        quote_dp: info("quote_dp"),
        created_time: info("created_time"),
        openInterest: new Decimal(open_interest || 0)
          .mul(index_price || 0)
          .toNumber(),
      };
    });
    return list || [];
  }, [symbolsInfo, futures]);

  const news = useMemo(
    () => sortList(markets, "created_time", "desc").slice(0, 5),
    [markets]
  );

  const gainers = useMemo(
    () => sortList(markets, "change", "desc").slice(0, 5),
    [markets]
  );

  const losers = useMemo(
    () => sortList(markets, "change", "asc").slice(0, 5),
    [markets]
  );

  const total24Amount = useMemo(
    () =>
      markets?.reduce((prevValue: Decimal, curValue: any) => {
        return prevValue.add(curValue["24h_amount"] || 0);
      }, new Decimal(0)) || new Decimal(0),
    [markets]
  );

  const totalOpenInterest = useMemo(
    () =>
      markets?.reduce((prevValue: Decimal, curValue: any) => {
        return prevValue.add(curValue["openInterest"] || 0);
      }, new Decimal(0)) || new Decimal(0),
    [markets]
  );

  const tvl = useMemo(() => {
    if (balance) {
      const { total_holding = 0, total_unsettled_balance = 0 } = balance as any;
      return new Decimal(total_holding)
        .plus(total_unsettled_balance)
        .toNumber();
    }
  }, [balance]);

  return {
    markets,
    news,
    gainers,
    losers,
    total24Amount: total24Amount.toNumber(),
    totalOpenInterest: totalOpenInterest.toNumber(),
    tvl,
  };
}
