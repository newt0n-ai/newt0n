import type { VerifyTypedDataParameters } from "viem";
import { toFacilitatorEvmSigner } from "@x402/evm";

import type { ZeroGWalletClient } from "../chains/0g";

export const createZeroGFacilitatorSigner = (
  zeroGWalletClient: ZeroGWalletClient
) =>
  toFacilitatorEvmSigner({
    getCode: (args: { address: `0x${string}` }) =>
      zeroGWalletClient.getCode(args),
    address: zeroGWalletClient.account.address,
    readContract: (args: {
      address: `0x${string}`;
      abi: readonly unknown[];
      functionName: string;
      args?: readonly unknown[];
    }) =>
      zeroGWalletClient.readContract({
        ...args,
        args: args.args || [],
      }),
    verifyTypedData: (args: {
      address: `0x${string}`;
      domain: Record<string, unknown>;
      types: Record<string, unknown>;
      primaryType: string;
      message: Record<string, unknown>;
      signature: `0x${string}`;
    }) => zeroGWalletClient.verifyTypedData(args as VerifyTypedDataParameters),
    writeContract: (args: {
      address: `0x${string}`;
      abi: readonly unknown[];
      functionName: string;
      args: readonly unknown[];
    }) =>
      zeroGWalletClient.writeContract({
        ...args,
        args: args.args || [],
      }),
    sendTransaction: (args: { to: `0x${string}`; data: `0x${string}` }) =>
      zeroGWalletClient.sendTransaction(args),
    waitForTransactionReceipt: (args: { hash: `0x${string}` }) =>
      zeroGWalletClient.waitForTransactionReceipt(args),
  });
