import { AccountStatusBar } from "@/block/accountStatus";
import {
  useAccount,
  useCollateral,
  useAccountInfo,
  OrderlyContext,
} from "@orderly.network/hooks";

import { useContext } from "react";

export const BottomNavBar = () => {
  const { account, login, state } = useAccount();
  const { data } = useAccountInfo();
  const { totalValue } = useCollateral();
  const { onWalletConnect } = useContext(OrderlyContext);

  return (
    <div className="fixed left-0 bottom-0 w-screen bg-base-200 p-2 border-t border-base-300 z-30">
      <AccountStatusBar
        chains={[]}
        status={state.status}
        address={state.address}
        accountInfo={data}
        totalValue={totalValue}
        onConnect={onWalletConnect}
      />
    </div>
  );
};
