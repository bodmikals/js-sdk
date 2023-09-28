import { WalletAdapter, WalletAdapterOptions } from "./adapter";
import { BrowserProvider, ethers, getAddress } from "ethers";
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";

export interface EtherAdapterOptions {
  provider: any;
  wallet: {
    name?: string;
  };
  // getAddresses?: (address: string) => string;
  chain: { id: string };
}

export class EtherAdapter implements WalletAdapter {
  private provider?: BrowserProvider;
  private _chainId: number;
  private _address: string;
  constructor(options: WalletAdapterOptions) {
    // super();
    console.log("EtherAdapter constructor", options);
    this._chainId = parseInt(options.chain.id, 16);
    this.provider = new BrowserProvider(options.provider, "any");
    this._address = options.address;
  }
  parseUnits(amount: string) {
    // throw new Error("Method not implemented.");

    return ethers.parseUnits(amount, 6).toString();
  }
  fromUnits(amount: string) {
    return ethers.formatUnits(amount, 6);
  }
  getBalance(
    contractId: string,
    userAddress: string,
    options: {
      abi: any;
    }
  ): Promise<any> {
    const contract = new ethers.Contract(
      contractId,
      options.abi,
      this.provider
    );
    // console.log("*********", contract);
    return contract.balanceOf(userAddress);
  }

  deposit(from: string, to: string, amount: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async call(
    address: string,
    method: string,
    params: any[],
    options: {
      abi: any;
    }
  ): Promise<any> {
    const singer = await this.provider?.getSigner();
    const contract = new ethers.Contract(address, options.abi, singer);

    return contract[method].apply(null, params).catch((error) => {
      const parsedEthersError = getParsedEthersError(error);

      throw parsedEthersError;
    });
  }

  get chainId(): number {
    return this._chainId;
  }

  get addresses(): string {
    return this._address;
  }

  async send(
    method: string,
    params: Array<any> | Record<string, any>
  ): Promise<any> {
    return await this.provider?.send(method, params);
  }

  async signTypedData(address: string, data: any) {
    return await this.provider?.send("eth_signTypedData_v4", [address, data]);
  }

  async verify(
    data: { domain: any; message: any; types: any },
    signature: string
  ) {
    const { domain, types, message } = data;

    const recovered = ethers.verifyTypedData(domain, types, message, signature);

    console.log("recovered", recovered);
  }
}
