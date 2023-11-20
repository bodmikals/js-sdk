import { Blockie } from "@/avatar";
import Button, { IconButton } from "@/button";
import React, { FC, useCallback } from "react";
import { Text } from "@/text";
import { useAccount, useMutation, useConfig } from "@orderly.network/hooks";
import { toast } from "@/toast";
import { modal } from "@/modal";
import { AccountStatusEnum } from "@orderly.network/types";
import { WalletConnectSheet } from "@/block/walletConnect";
import { CopyIcon } from "@/icon";
import { useGetChains } from "./useGetChains";

export interface AccountInfoProps {
  onDisconnect?: () => void;
  accountId?: string;
  close?: () => void;
  showGetTestUSDC?: boolean;
}

export const AccountInfo: FC<AccountInfoProps> = (props) => {
  const { onDisconnect } = props;
  const { account, state } = useAccount();
  // const [loading,setLoading] = React.useState(false);
  const config = useConfig();

  const [getTestUSDC, { isMutating }] = useMutation(
    `${config.get("operatorUrl")}/v1/faucet/usdc`
  );

  const chainName = useGetChains();

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(state.address).then(() => {
      toast.success("Copied to clipboard");
    });
  }, [state]);

  const onGetClick = useCallback(() => {
    if (state.status < AccountStatusEnum.EnableTrading) {
      return modal.show(WalletConnectSheet, {
        status: state.status,
      });
    }

    return getTestUSDC({
      chain_id: account.wallet.chainId.toString(),
      user_address: state.address,
      broker_id: config.get("brokerId"),
    }).then(
      (res: any) => {
        if (res.success) {
          props.close?.();
          return modal.confirm({
            title: "Get test USDC",
            content:
              "1,000 USDC will be added to your balance. Please note this may take up to 3 minutes. Please check back later.",
            onOk: () => {
              return Promise.resolve();
            },
          });
        }
        res.message && toast.error(res.message);
        // return Promise.reject(res);
      },
      (error: Error) => {
        toast.error(error.message);
      }
    );
  }, [state]);

  return (
    <div>
      <div className="orderly-flex orderly-py-6">
        <div className="orderly-flex-1 orderly-flex orderly-items-center orderly-gap-2">
          <Blockie address={state.address} />
          <div className="orderly-flex orderly-flex-col">
            <Text rule={"address"}>{account.address}</Text>
            <div className="orderly-text-4xs">{chainName}</div>
          </div>
        </div>
        <div className="orderly-flex orderly-items-center orderly-gap-2">
          <IconButton type="button" onClick={onCopy} className="orderly-px-0">
            <CopyIcon size={40} />
          </IconButton>
          {/* <IconButton>
            <Share size={20} />
          </IconButton> */}
        </div>
      </div>
      {props.showGetTestUSDC ? (
        <div className="orderly-py-4 orderly-grid orderly-grid-cols-2 orderly-gap-3">
          <Button
            variant={"outlined"}
            onClick={onGetClick}
            disabled={isMutating}
            loading={isMutating}
          >
            Get test USDC
          </Button>

          <Button
            className="orderly-text-xs"
            variant={"outlined"}
            color={"sell"}
            fullWidth
            onClick={() => {
              onDisconnect?.();
            }}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="orderly-flex orderly-justify-center">
          <Button
            className="orderly-text-xs"
            variant={"outlined"}
            fullWidth
            onClick={() => {
              onDisconnect?.();
            }}
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};
