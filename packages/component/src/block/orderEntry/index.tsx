"use client";

import { Input } from "@/input";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { Slider } from "@/slider";
import {
  FC,
  FormEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Picker, Select } from "@/select";
import Button from "@/button";
import { Numeral, Text } from "@/text";

import { Divider } from "@/divider";
import { OrderOptions } from "./sections/orderOptions";
import { useEventEmitter, useLocalStorage } from "@orderly.network/hooks";

import { API, OrderEntity, OrderSide, OrderType } from "@orderly.network/types";
import { modal } from "@/modal";
import { OrderConfirmView } from "./sections/orderConfirmView";
import { toast } from "@/toast";
import { StatusGuardButton } from "@/button/statusGuardButton";
import { Decimal } from "@orderly.network/utils";
import { MSelect } from "@/select/mSelect";

export interface OrderEntryProps {
  onSubmit?: (data: any) => Promise<any>;
  onDeposit?: () => Promise<void>;

  markPrice?: number;
  maxQty: number;

  symbol: string;

  symbolConfig: API.SymbolExt;

  freeCollateral?: number;

  showConfirm?: boolean;
  onConfirmChange?: (value: boolean) => void;

  reduceOnly?: boolean;
  onReduceOnlyChange?: (value: boolean) => void;

  side: OrderSide;
  onSideChange?: (value: OrderSide) => void;

  helper: any;

  disabled?: boolean;
}

interface OrderEntryRef {
  reset: () => void;
  setValues: (values: Partial<OrderEntity>) => void;
  setValue: (name: keyof OrderEntity, value: any) => void;
}

const { Segmented: SegmentedButton } = Button;

export const OrderEntry = forwardRef<OrderEntryRef, OrderEntryProps>(
  (props, ref) => {
    const {
      freeCollateral,
      symbolConfig,
      maxQty,
      symbol,
      side,
      onSideChange,
      helper,
      disabled,
      markPrice,
    } = props;

    const { calculate, validator } = helper;

    const totalInputFocused = useRef<boolean>(false);

    const [needConfirm, setNeedConfirm] = useLocalStorage(
      "orderly_order_confirm",
      true
    );

    const methods = useForm({
      // mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        side: OrderSide.BUY,
        order_type: OrderType.LIMIT,
        order_quantity: "",
        total: "",
        order_price: "",
        reduce_only: false,
      },
      resolver: async (values) => {
        //
        const errors = await validator(values);
        return {
          values,
          errors,
        };
      },
    });

    const ee = useEventEmitter();

    const orderbookItemClickHandler = useCallback((item: number[]) => {
      methods.setValue("order_price", item[0].toString());
      methods.setValue("order_type", OrderType.LIMIT);
    }, []);

    useEffect(() => {
      ee.on("orderbook:item:click", orderbookItemClickHandler);

      () => {
        ee.off("orderbook:item:click", orderbookItemClickHandler);
      };
    }, []);

    const [buttonText, setButtonText] = useState<string>("Buy / Long");

    const priceInputRef = useRef<HTMLInputElement | null>(null);

    const onSubmit = useCallback(
      (data: any) => {
        //

        return Promise.resolve()
          .then(() => {
            if (needConfirm) {
              return modal.confirm({
                title: "Confirm Order",
                onCancel: () => {
                  return Promise.reject("cancel");
                },
                content: (
                  <OrderConfirmView
                    order={{ ...data, side: props.side, symbol: props.symbol }}
                    symbol={symbol}
                    base={symbolConfig["base"]}
                    quote={symbolConfig.quote}
                  />
                ),
              });
            } else {
              return Promise.resolve(true);
            }
          })
          .then(
            (isOk) => {
              return props
                .onSubmit?.({
                  ...data,
                  side: props.side,
                  symbol: props.symbol,
                })
                .then(
                  (res) => {
                    if (res.success) {
                      methods.reset({
                        order_type: data.order_type,
                        order_price: "",
                        order_quantity: "",
                        total: "",
                      });
                      toast.success("Successfully!");
                    }

                    // resetForm?.();
                  },
                  (error: Error) => {
                    toast.error(error.message);
                  }
                );
            },
            (err) => {}
          );

        // return modal
        //   .confirm({
        //     title: "Confirm Order",
        //     onCancel: () => {
        //       return Promise.reject("cancel");
        //     },
        //     content: (
        //       <OrderConfirmView
        //         order={{ ...data, side: props.side, symbol: props.symbol }}
        //         symbol={symbol}
        //         base={symbolConfig["base"]}
        //         quote={symbolConfig.quote}
        //       />
        //     ),
        //   })
        //   .then(

        //   );
      },
      [side, props.onSubmit, symbol, needConfirm]
    );

    useEffect(() => {
      methods.setValue("order_price", "");
      methods.setValue("order_quantity", "");
      methods.setValue("total", "");
      methods.clearErrors();
    }, [symbol]);

    const onDeposit = useCallback((event: FormEvent) => {
      event.preventDefault();
      props.onDeposit?.();
    }, []);

    useEffect(() => {
      if (side === OrderSide.BUY) {
        setButtonText("Buy / Long");
      } else {
        setButtonText("Sell / Short");
      }
      methods.setValue("side", side);
      methods.clearErrors();
    }, [side]);

    useEffect(() => {
      const subscription = methods.watch((value, { name, type }) => {
        if (type === "change") {
          if (name === "reduce_only") {
          }
        }
      });
      return () => subscription.unsubscribe();
    }, []);

    const onFieldChange = (name: string, value: any) => {
      const newValues: OrderEntity = calculate(
        methods.getValues(),
        name,
        value
      );
      //

      if (name === "order_price") {
        methods.setValue("order_price", newValues.order_price as string, {
          shouldValidate: methods.formState.submitCount > 0,
        });
      }

      methods.setValue("total", newValues.total as string, {
        shouldValidate: methods.formState.submitCount > 0,
      });
      methods.setValue("order_quantity", newValues.order_quantity as string, {
        shouldValidate: methods.formState.submitCount > 0,
      });
    };

    //

    const totalAmount = useMemo(() => {
      const quantity = methods.getValues("order_quantity");
      if (
        !markPrice ||
        methods.getValues("order_type") !== OrderType.MARKET ||
        totalInputFocused.current ||
        !quantity
      ) {
        return methods.getValues("total");
      }

      return new Decimal(quantity).mul(markPrice).todp(2).toString();
    }, [
      markPrice,
      methods.getValues("order_type"),
      methods.getValues("order_quantity"),
    ]);

    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <SegmentedButton
              buttons={[
                {
                  label: "Buy",
                  value: OrderSide.BUY,
                  disabled,
                  activeClassName:
                    "bg-trade-profit text-trade-profit-foreground after:bg-trade-profit",
                  disabledClassName:
                    "bg-[#394155] text-white/10 after:bg-[#394155] cursor-not-allowed",
                },
                {
                  label: "Sell",
                  value: OrderSide.SELL,
                  disabled,
                  activeClassName:
                    "bg-trade-loss text-trade-loss-foreground after:bg-trade-loss",
                  disabledClassName:
                    "bg-[#394155] text-white/10 after:bg-[#394155] cursor-not-allowed",
                },
              ]}
              onChange={(value) => {
                onSideChange?.(value as OrderSide);
              }}
              value={side}
            />

            <div className={"flex justify-between items-center"}>
              <div className="flex gap-1 text-gray-500 text-sm">
                <span>Free Collat.</span>
                <Numeral
                  rule="price"
                  className="text-base-contrast/80"
                  precision={0}
                >{`${freeCollateral ?? "--"}`}</Numeral>

                <span>USDC</span>
              </div>
              <Button
                variant={"text"}
                size={"small"}
                type="button"
                onClick={onDeposit}
                className="text-primary-light"
              >
                Deposit
              </Button>
            </div>
            <Controller
              name="order_type"
              control={methods.control}
              render={({ field }) => {
                return (
                  <MSelect
                    label={"Order Type"}
                    value={field.value}
                    color={side === OrderSide.BUY ? "buy" : "sell"}
                    fullWidth
                    options={[
                      { label: "Limit order", value: "LIMIT" },
                      {
                        label: "Market order",
                        value: "MARKET",
                      },
                    ]}
                    onChange={(value) => {
                      field.onChange(value);
                      methods.setValue("order_price", "", {
                        shouldValidate: false,
                      });

                      methods.clearErrors();
                    }}
                    // onValueChange={(value: any) => {
                    //   // setValue?.("order_type", value.value);
                    //   field.onChange(value.value);
                    //   methods.setValue("order_price", "", {
                    //     shouldValidate: true,
                    //   });
                    // }}
                  />
                );
              }}
            />

            <Controller
              name="order_price"
              control={methods.control}
              render={({ field }) => {
                const isMarketOrder =
                  methods.getValues("order_type") === OrderType.MARKET;

                return (
                  <Input
                    disabled={disabled}
                    ref={priceInputRef}
                    prefix="Price"
                    suffix={symbolConfig?.quote}
                    type="text"
                    inputMode="decimal"
                    error={!!methods.formState.errors?.order_price}
                    // placeholder={"Market"}
                    helpText={methods.formState.errors?.order_price?.message}
                    value={isMarketOrder ? "Market" : field.value}
                    className={"text-right"}
                    containerClassName={
                      isMarketOrder ? "bg-base-300" : undefined
                    }
                    readOnly={isMarketOrder}
                    onChange={(event) => {
                      // field.onChange(event.target.value);
                      onFieldChange("order_price", event.target.value);
                    }}
                  />
                );
              }}
            />

            <Controller
              name="order_quantity"
              control={methods.control}
              render={({ field }) => {
                return (
                  <Input
                    disabled={disabled}
                    prefix={"Quantity"}
                    type="text"
                    inputMode="decimal"
                    suffix={symbolConfig?.base}
                    className="text-right"
                    error={!!methods.formState.errors?.order_quantity}
                    helpText={methods.formState.errors?.order_quantity?.message}
                    value={field.value}
                    onChange={(event) => {
                      onFieldChange("order_quantity", event.target.value);
                    }}
                  />
                );
              }}
            />

            <Controller
              name="order_quantity"
              control={methods.control}
              render={({ field }) => {
                return (
                  <Slider
                    color={side === OrderSide.BUY ? "buy" : "sell"}
                    markLabelVisible={false}
                    min={0}
                    max={maxQty === 0 ? 1 : maxQty}
                    markCount={4}
                    disabled={maxQty === 0}
                    step={symbolConfig?.["base_tick"]}
                    value={[Number(field.value ?? 0)]}
                    onValueChange={(value) => {
                      //
                      if (typeof value[0] !== "undefined") {
                        // field.onChange(value[0]);
                        onFieldChange("order_quantity", value[0]);
                      }
                    }}
                  />
                );
              }}
            />

            <Controller
              name="total"
              control={methods.control}
              render={({ field }) => {
                return (
                  <Input
                    disabled={disabled}
                    className={"text-right"}
                    prefix={"Total ≈"}
                    suffix={symbolConfig?.quote}
                    type="text"
                    inputMode="decimal"
                    // value={field.value}
                    value={
                      totalInputFocused.current ? field.value : totalAmount
                    }
                    onFocus={() => (totalInputFocused.current = true)}
                    onBlur={() => (totalInputFocused.current = false)}
                    onChange={(event) => {
                      // field.onChange(event.target.value);
                      onFieldChange("total", event.target.value);
                    }}
                  />
                );
              }}
            />

            <Divider />
            <OrderOptions
              showConfirm={needConfirm}
              onConfirmChange={setNeedConfirm}
            />
            <StatusGuardButton>
              <Button
                type="submit"
                loading={methods.formState.isSubmitting}
                color={side === OrderSide.BUY ? "buy" : "sell"}
                fullWidth
              >
                {buttonText}
              </Button>
            </StatusGuardButton>
          </div>
        </form>
      </FormProvider>
    );
  }
);
