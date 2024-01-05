import { definedTypes } from "./constants";
import {
  keccak256,
  AbiCoder,
  solidityPackedKeccak256,
  parseUnits,
  formatUnits,
  Numeric,
} from "ethers";

export { parseUnits } from "ethers";

export type SignatureDomain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};

export const base64url = function (aStr: string): string {
  return aStr.replace(/\+/g, "-").replace(/\//g, "_");
};

export function parseBrokerHash(brokerId: string) {
  return calculateStringHash(brokerId);
}

export function parseAccountId(userAddress: string, brokerId: string) {
  const abicoder = AbiCoder.defaultAbiCoder();
  return keccak256(
    abicoder.encode(
      ["address", "bytes32"],
      [userAddress, parseBrokerHash(brokerId)]
    )
  );
}

export function parseTokenHash(tokenSymbol: string) {
  return calculateStringHash(tokenSymbol);
}

export function calculateStringHash(input: string) {
  return solidityPackedKeccak256(["string"], [input]);
}

// export function parseUnits(amount: string) {
//   return parseUnits(amount, 6).toString();
// }

export function formatByUnits(
  amount: string,
  unit: number | "ether" | "gwei" = "ether"
) {
  return formatUnits(amount, unit);
}

export function isHex(value: string): boolean {
  const hexRegex = /^[a-f0-9]+$/iu;
  return hexRegex.test(value);
}

export function isHexString(value: string): boolean {
  return typeof value === "string" && value.startsWith("0x") && isHex(value);
}
