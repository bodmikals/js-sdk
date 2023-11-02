import { Checkbox } from "@/checkbox";
import { Collapsible, CollapsibleContent } from "@/collapsible";
import { Label } from "@/label";
import { Radio, RadioGroup } from "@/radioGroup";
import { Switch } from "@/switch";
import { cn } from "@/utils/css";
import { OrderType } from "@orderly.network/types";
import { OrderEntity } from "@orderly.network/types";
import { ChevronDown } from "lucide-react";
import { FC, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { OrderTypesCheckbox } from "./orderTypes";
import { modal } from "@/modal";

interface OrderOptionsProps {
  // values?: OrderEntity;
  // setValue?: (name: keyof OrderEntity, value: any) => void;
  // reduceOnly?: boolean;
  // onReduceOnlyChange?: (value: boolean) => void;
  showConfirm?: boolean;
  onConfirmChange?: (value: boolean) => void;
}

export const OrderOptions: FC<OrderOptionsProps> = (props) => {
  // const {reduceOnly,onReduceOnlyChange} = props
  const [open, setOpen] = useState<boolean>(false);
  const { control, getValues, setValue } = useFormContext();

  const showReduceOnlyHint = (reduceOnly: boolean) => {
    modal.alert({
      title: reduceOnly ? "Reduce only" : "Hidden",
      message: (
        <span className="text-sm text-base-contrast/60">
          {reduceOnly
            ? "Reduce only ensures that you can only reduce or close a current position so that your position size will not be increased unintentionally."
            : "Hidden order is a limit order that does not appear in the orderbook."}
        </span>
      ),
    });
  };

  return (
    <>
      <div className="flex items-center py-[2px] justify-between">
        <Controller
          name="reduce_only"
          control={control}
          render={({ field }) => {
            return (
              <div className="flex gap-2 items-center">
                <Switch
                  id="reduceOnly"
                  color={"profit"}
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    // props.setValue?.("reduce_only", checked)
                    field.onChange(checked)
                  }
                />
                {/* 移除htmlFor="reduceOnly", 点击标签不触发Switch开关的变化 */}
                <Label
                  onClick={() => {
                    showReduceOnlyHint(field.value);
                  }}
                >
                  Reduce only
                </Label>
              </div>
            );
          }}
        />

        <button
          type="button"
          className="w-[18px] h-[18px] px-5 text-base-contrast/60"
          onClick={() => setOpen((open) => !open)}
        >
          <ChevronDown
            size={18}
            className={cn(
              "transition-transform text-base-contrast/50",
              open && "rotate-180"
            )}
          />
        </button>
      </div>
      <Collapsible open={open}>
        <CollapsibleContent>
          <div className="pb-2 space-y-4">
            {getValues("order_type") === OrderType.LIMIT && (
              <Controller
                name="order_type_ext"
                control={control}
                shouldUnregister={getValues("order_type") === OrderType.MARKET}
                render={({ field }) => {
                  return (
                    <div>
                      <OrderTypesCheckbox
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                      {/* <RadioGroup
                        value={field.value}
                        className="flex gap-5"
                        onValueChange={(value) => {
                          // 
                          // setValue("order_type_ext", value);
                          field.onChange(value);
                        }}
                      >
                        <Radio value={OrderType.POST_ONLY}>Post only</Radio>
                        <Radio value={OrderType.IOC}>IOC</Radio>
                        <Radio value={OrderType.FOK}>FOK</Radio>
                      </RadioGroup> */}
                    </div>
                  );
                }}
              />
            )}
            <div className="flex gap-5">
              <div className="flex gap-2 items-center">
                <Checkbox
                  id="orderConfirm"
                  checked={props.showConfirm}
                  onCheckedChange={(checked) => {
                    props.onConfirmChange?.(!!checked);
                  }}
                />
                <Label htmlFor="orderConfirm">Order confirm</Label>
              </div>
              <Controller
                name="visible_quantity"
                control={control}
                render={({ field }) => {
                  return (
                    <div className="flex gap-2 items-center">
                      <Checkbox
                        id="hidden"
                        checked={field.value === 0}
                        onCheckedChange={(checked) => {
                          // props.setValue?.("visible_quantity", checked ? 0 : 1);
                          field.onChange(checked ? 0 : 1);
                        }}
                      />
                      <Label htmlFor="hidden">Hidden</Label>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
