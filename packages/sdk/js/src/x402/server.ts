import { ExactEvmScheme as X402ExactEvmScheme } from "@x402/evm/exact/server";

export type Stablecoin = {
  address: string;
  name: string;
  decimal: number;
  version: string;
  assetTransferMethod?: "permit2";
  supportsEip2612?: true;
};
export type DefaultStablecoins = Record<string, Stablecoin>;

export const DEFAULT_STABLECOINS: DefaultStablecoins = {
  "eip155:16661": {
    address: "0x1f3aa82227281ca364bfb3d253b0f1af1da6473e",
    name: "Bridged USDC",
    decimal: 6,
    version: "2",
  },
};

export const convertToTokenAmount = (
  decimalAmount: string,
  decimals: number
) => {
  const amount = parseFloat(decimalAmount);
  if (Number.isNaN(amount)) {
    throw new Error(`Invalid amount: ${decimalAmount}`);
  }
  const [intPart, decPart = ""] = String(amount).split(".");
  const paddedDec = decPart.padEnd(decimals, "0").slice(0, decimals);
  const tokenAmount = (intPart + paddedDec).replace(/^0+/, "") || "0";
  return tokenAmount;
};

export class ExactEvmScheme extends X402ExactEvmScheme {
  constructor() {
    super();

    this.registerMoneyParser(async (amount: number, network: string) => {
      const assetInfo = DEFAULT_STABLECOINS[network];
      if (!assetInfo) return null;

      const tokenAmount = convertToTokenAmount(
        amount.toString(),
        assetInfo.decimal
      );

      const includeEip712Domain =
        !assetInfo.assetTransferMethod || assetInfo.supportsEip2612;

      return {
        amount: tokenAmount,
        asset: assetInfo.address,
        extra: {
          ...(includeEip712Domain && {
            name: assetInfo.name,
            version: assetInfo.version,
          }),
          ...(assetInfo.assetTransferMethod && {
            assetTransferMethod: assetInfo.assetTransferMethod,
          }),
        },
      };
    });
  }
}
