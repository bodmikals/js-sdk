import { Button, Numeral, modal } from "@orderly.network/react";
import { useContext, useMemo } from "react";
import { ReferralContext } from "../../hooks/referralContext";
import { USDCIcon } from "../../affiliate/icons";
import { ArrowRightIcon } from "../icons/arrowRight";
import { TraderIcon } from "../icons/trader";
import { InputCode } from "./enterCode";
export const AsAnTrader = () => {

  const { referralInfo, isTrader, mutate, bindReferralCodeState } = useContext(ReferralContext);

  const enterCode = () => {
    modal.show(InputCode,{mutate, bindReferralCodeState});
  };

  const bottomInfo = useMemo(() => {
    const totalReferrerRebate = referralInfo?.referee_info?.total_referee_rebate;

    if (isTrader) {
      return (
        <div className="orderly-mt-3 orderly-text-[24px] lg:orderly-txt-[26px] 2xl:orderly-text-[30[px] orderly-flex orderly-justify-between">
          <div className="orderly-flex-1 orderly-flex">
            <div className="orderly-mr-3 orderly-w-[28px] orderly-h-[28px] xl:orderly-w-[32px] xl:orderly-h-[32px] 2xl:orderly-w-[36px] 2xl:orderly-h-[36px]">
              <USDCIcon width={"100%"} height={"100%"} />
            </div>
              <Numeral precision={2} children={totalReferrerRebate} />
          </div>

          <button className="orderly-flex orderly-items-center orderly-text-xs md:orderly-text-base 2xl:orderly-text-lg orderly-gap-2">
            Enter
            <ArrowRightIcon fill="white" fillOpacity={0.98}/>
          </button>
        </div>
      );
    }


    return (
      <div className="orderly-flex orderly-justify-between orderly-mt-2">
      <Button onClick={enterCode} className="orderly-text-base xl:orderly-text-lg 2xl:orderly-text-lg">Enter code</Button>

      <div>
        <div className="orderly-text-[22px] md:orderly-text-[24px] lg:orderly-text-[26px] xl:orderly-text-[26px] 2xl:orderly-text-[28px]">0%~20%</div>
        <div className="orderly-text-3xs 2xl:orderly-text-xs orderly-text-right">Rebate</div>
      </div>
    </div>
    );

  }, [referralInfo?.referee_info?.total_referee_rebate, isTrader, enterCode]);

  return (
    <div className="orderly-rounded-lg orderly-p-6 orderly-w-full orderly-bg-[rgba(0,104,92,1)]">
    <div className="orderly-flex orderly-justify-between">
      <div className="orderly-justify-between">
        <div className="orderly-text-2xl lg:orderly-text-[26px] xl:orderly-text-[28px] 2xl:orderly-text-[30px]">As a trader</div>
        <div className="orderly-mt-6 orderly-text-2xs lg:orderly-text-xs md:orderly-text-xs xl:orderly-text-xs 2xl:orderly-text-base">
        Get fee rebates on every trade
        </div>
      </div>
      <TraderIcon />
    </div>

    {bottomInfo}
  </div>
  );
};
