import { Button, Numeral } from "@orderly.network/react";
import { ReferralIcon } from "../icons/referral";
import { useContext, useMemo } from "react";
import { ReferralContext } from "../../hooks/referralContext";
import { USDCIcon } from "../../affiliate/icons";
import { ArrowRightIcon } from "../icons/arrowRight";


export const AsAnAffiliate = () => {

  const { referralInfo, isAffiliate, becomeAnAffiliate, becomeAnAffiliateUrl } = useContext(ReferralContext);

  const bottomInfo = useMemo(() => {
    const totalReferrerRebate = referralInfo?.referrer_info?.total_referrer_rebate;

    if (isAffiliate) {
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
        <Button
          onClick={() => {
            if (becomeAnAffiliate) {
              becomeAnAffiliate?.();
            } else if (becomeAnAffiliateUrl) {
              window.open(becomeAnAffiliateUrl, "__blank");
            }
          }}
          className="orderly-text-base xl:orderly-text-lg 2xl:orderly-text-lg"
        >Become an affliate</Button>

        <div>
          <div className="orderly-text-[22px] md:orderly-text-[24px] lg:orderly-text-[26px] xl:orderly-text-[26px] 2xl:orderly-text-[28px]">40%~80%</div>
          <div className="orderly-text-3xs 2xl:orderly-text-xs orderly-text-right">Commission</div>
        </div>
      </div>
    );

  }, [referralInfo?.referrer_info?.total_referrer_rebate, isAffiliate]);

  return (
    <div className="orderly-rounded-lg orderly-w-full orderly-p-6 orderly-bg-gradient-to-t orderly-to-[rgba(41,137,226,1)] orderly-from-[rgba(39,43,147,1)]">
      <div className="orderly-flex orderly-justify-between">
        <div className="orderly-justify-between">
          <div className="orderly-text-2xl lg:orderly-text-[26px] xl:orderly-text-[28px] 2xl:orderly-text-[30px]">As an affiliate</div>
          <div className="orderly-mt-6 orderly-text-2xs lg:orderly-text-xs md:orderly-text-xs xl:orderly-text-xs 2xl:orderly-text-base">
            Onboard traders to earn passive income
          </div>
        </div>
        <ReferralIcon />
      </div>

      {bottomInfo}

    </div>
  );
};
