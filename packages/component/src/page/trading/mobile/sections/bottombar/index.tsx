import { AccountStatusBar } from "@/block/accountStatus";
import { ChainIdSwtich } from "@/block/accountStatus/sections/chainIdSwitch";
import { GetTestUSDC } from "@/block/operation/getTestUSDC";
import { WalletConnectSheet } from "@/block/walletConnect";
import { modal } from "@/modal";
import { OrderlyAppContext } from "@/provider";
import {
  useAccount,
  useCollateral,
  useAccountInfo,
  OrderlyContext,
  useWalletConnector,
} from "@orderly.network/hooks";
import { AccountStatusEnum } from "@orderly.network/types";
import { isTestnet } from "@orderly.network/utils";

import { useCallback, useContext, useMemo } from "react";

export const BottomNavBar = () => {
  const { state } = useAccount();
  const { data } = useAccountInfo();
  const { totalValue } = useCollateral();
  const { errors } = useContext(OrderlyAppContext);
  const { onWalletConnect, onSetChain, onWalletDisconnect } =
    useContext(OrderlyAppContext);

  const { connectedChain } = useWalletConnector();

  const onConnect = useCallback(() => {
    onWalletConnect().then(
      (result: { wallet: any; status: AccountStatusEnum }) => {
        if (result && result.status < AccountStatusEnum.EnableTrading) {
          modal.show(WalletConnectSheet, {
            status: result.status,
          });
        }
      }
    );
  }, []);

  const showGetTestUSDC = useMemo(() => {
    const chainId = connectedChain?.id;
    if (chainId === undefined) {
      return false;
    }

    return (
      state.status === AccountStatusEnum.EnableTrading &&
      isTestnet(parseInt(chainId))
    );
  }, [state.status, connectedChain]);

  return (
    <>
      {showGetTestUSDC && <GetTestUSDC />}
      {errors.ChainNetworkNotSupport && (
        <ChainIdSwtich onSetChain={onSetChain} />
      )}
      <div
        id="orderly-botom-bar-container"
        className="orderly-fixed orderly-left-0 orderly-bottom-0 orderly-w-screen orderly-bg-base-800 orderly-p-[14px] orderly-pb-[20px] orderly-border-t orderly-border-base-contrast/10 orderly-z-30 orderly-h-[64px] orderly-flex orderly-justify-between orderly-items-center"
      >
        <AccountStatusBar
          chains={[]}
          status={state.status}
          address={state.address}
          accountInfo={data}
          totalValue={totalValue}
          onConnect={onConnect}
          onDisconnect={onWalletDisconnect}
          showGetTestUSDC={showGetTestUSDC}
        />
      </div>
    </>
  );
};
