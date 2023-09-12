import { createContext } from "react";

import {
  type ConfigStore,
  type OrderlyKeyStore,
  type WalletAdapter,
} from "@orderly.network/core";
import { IContract } from "@orderly.network/core";

export interface OrderlyAppConfig {
  logoUrl: string;
  theme: any;
}

export type AppStateErrors = {
  ChainNetworkNotSupport: boolean;
  IpNotSupport: boolean;
  NetworkError: boolean;
};
export interface OrderlyContextState extends OrderlyAppConfig {
  // coin cion generator

  // ws: WebSocketAdpater;
  fetcher?: (url: string, init: RequestInit) => Promise<any>;
  apiBaseUrl: string;
  klineDataUrl: string;
  configStore: ConfigStore;
  keyStore: OrderlyKeyStore;
  walletAdapter: { new (options: any): WalletAdapter };
  contractManager: IContract;
  networkId: string;

  onWalletConnect?: () => Promise<any>;
  onWalletDisconnect?: () => Promise<any>;

  onSetChain?: (chainId: number) => Promise<any>;
  // account: Account;

  ready: boolean;

  onAppTestChange?: (name: string) => void;

  errors: AppStateErrors;
}

export const OrderlyContext = createContext<OrderlyContextState>({
  // configStore: new MemoryConfigStore(),
} as OrderlyContextState);

export const OrderlyProvider = OrderlyContext.Provider;
