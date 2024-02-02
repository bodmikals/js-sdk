import { renderHook } from "@testing-library/react-hooks";
import { useOrderEntry } from "../src/orderly/useOrderEntry";
import { OrderSide, OrderType } from "@orderly.network/types";

describe("useOrderEntry", () => {
  test("should return the correct initial values", () => {
    const { result } = renderHook(() =>
      useOrderEntry({
        side: OrderSide.BUY,
        order_type: OrderType.LIMIT,
        symbol: "PERP_ETH_USDC",
      })
    );

    // expect(result.current.doCreateOrder).toBeDefined();
    // expect(result.current.data).toBeNull();
    // expect(result.current.error).toBeNull();
    expect(result.current.reset).toBeDefined();
    // Add more assertions for other values returned by the hook
  });

  // Add more test cases to cover different scenarios and edge cases
});
