import { useMemo } from "react";
import {
  useAccount,
  useConfig,
  useChains,
  useWalletConnector,
} from "@orderly.network/hooks";
import {
  AccountStatusEnum,
  NetworkId,
  NetworkStatusEnum,
} from "@orderly.network/types";

export const useAppState = (): {
  wrongNetwork: boolean;
  networkStatus: NetworkStatusEnum;
} => {
  // const keyStore = useKeyStore();
  const config = useConfig();
  const networkId = config.get("networkId");
  const [_, { checkChainSupport }] = useChains();

  const { connectedChain } = useWalletConnector();
  // restore account state
  // useEffect(() => {
  //   console.log("current address:", keyStore.getAddress());
  // }, []);
  //

  const networkStatus = useMemo(() => {
    if (!connectedChain) return NetworkStatusEnum.unknown;

    return checkChainSupport(connectedChain.id, networkId as NetworkId)
      ? NetworkStatusEnum.supported
      : NetworkStatusEnum.unsupported;
  }, [networkId, connectedChain]);

  return {
    wrongNetwork: networkStatus === NetworkStatusEnum.unsupported,
    networkStatus,
  };
};
