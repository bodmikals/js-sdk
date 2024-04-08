import { Button, Numeral, modal } from "@orderly.network/react";
import { useContext, useMemo } from "react";
import { ReferralContext } from "../../hooks/referralContext";
import { USDCIcon } from "../../affiliate/icons";
import { ArrowRightIcon } from "../icons/arrowRight";
import { TraderIcon } from "../icons/trader";
import { ReferralInputCode } from "./enterCode";
import { commify } from "@orderly.network/utils";
export const AsAnTrader = () => {

  const { referralInfo, isTrader, mutate, bindReferralCodeState, enterTraderPage } = useContext(ReferralContext);

  const enterCode = () => {
    modal.show(ReferralInputCode, { mutate, bindReferralCodeState });
  };

  const bottomInfo = useMemo(() => {
    const totalReferrerRebate = referralInfo?.referee_info?.total_referee_rebate;

    if (isTrader) {
      return (
        <div className="orderly-mt-3 orderly-text-[24px] lg:orderly-txt-[26px] 2xl:orderly-text-[30[px] orderly-flex orderly-justify-between orderly-items-end">

          <div>
            <div className="orderly-text-xs md:orderly-text-base 2xl:orderly-text-[18px]">Rebate (USDC)</div>
            <div className="orderly-flex-1 orderly-flex orderly-items-center orderly-mt-3">
              <div className="orderly-mr-3 orderly-w-[28px] orderly-h-[28px] xl:orderly-w-[32px] xl:orderly-h-[32px] 2xl:orderly-w-[36px] 2xl:orderly-h-[36px]">
                <USDCIcon width={"100%"} height={"100%"} />
              </div>
              <div >{commify(totalReferrerRebate != undefined ? totalReferrerRebate : '-', 2)}</div>
            </div>
          </div>

          <button onClick={() => enterTraderPage?.({ tab: 1 })} className="orderly-flex orderly-items-center orderly-text-xs md:orderly-text-base 2xl:orderly-text-lg orderly-gap-2">
            Enter
            <ArrowRightIcon fill="white" fillOpacity={0.98} />
          </button>
        </div>
      );
    }


    return (
      <div className="orderly-flex orderly-justify-between orderly-mt-2 orderly-items-center">
        <Button
          id="referral_as_a_trader_btn"
          onClick={enterCode}
          className="orderly-bg-white orderly-text-base-900 xl:orderly-text-lg 2xl:orderly-text-lg orderly-px-3 orderly-h-[44px]"
        >
          Enter code
        </Button>

        <div>
          <div className="orderly-text-[22px] md:orderly-text-[24px] lg:orderly-text-[26px] xl:orderly-text-[26px] 2xl:orderly-text-[28px]">0%~20%</div>
          <div className="orderly-text-3xs 2xl:orderly-text-xs orderly-text-right">Rebate</div>
        </div>
      </div>
    );

  }, [referralInfo?.referee_info?.total_referee_rebate, isTrader, enterCode]);



  return (
    <div className="orderly-rounded-xl orderly-p-6 orderly-w-full orderly-bg-[rgba(0,104,92,1)] orderly-h-[196px] lg:orderly-h-[221px] xl:orderly-h-[216px] 2xl:orderly-h-[248px] orderly-flex orderly-flex-col orderly-justify-between">
      <div className="orderly-flex orderly-justify-between">
        <div className="orderly-justify-between">
          <div className="orderly-text-2xl lg:orderly-text-[26px] xl:orderly-text-[28px] 2xl:orderly-text-[30px]">{isTrader ? 'Trader' : 'As a trader'}</div>
          {!isTrader && <div className="orderly-mt-6 orderly-text-2xs lg:orderly-text-xs md:orderly-text-xs xl:orderly-text-xs 2xl:orderly-text-base">
            Get fee rebates on every trade
          </div>}
        </div>
        <TraderIcon />
      </div>

      {bottomInfo}
    </div>
  );
};
