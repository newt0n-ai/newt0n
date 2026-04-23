import type { Address, Hex } from "viem";
import { x402Facilitator } from "@x402/core/facilitator";
import { createMiddleware } from "hono/factory";
import { privateKeyToAccount } from "viem/accounts";

import type { Env } from "../env";
import type { EvmChainId, EvmWalletClient } from "../lib/chains/evm";
import { createEvmWalletClient, SUPPORTED_EVM_CHAINS } from "../lib/chains/evm";
import {
  registerEvmExactScheme,
  registerEvmUptoScheme,
} from "../lib/x402/scheme";
import { createEvmFacilitatorSigner } from "../lib/x402/signer";

export type X402FacilitatorClientVariables = {
  X402_FACILITATOR: x402Facilitator;
  X402_ROUTER_ADDRESS: Address;
  X402_WALLET_CLIENTS: Partial<Record<EvmChainId, EvmWalletClient>>;
};

const RPC_URL_BY_CHAIN: Record<EvmChainId, keyof CloudflareBindings> = {
  "eip155:16661": "ZEROG_MAINNET_RPC_URL",
  "eip155:16602": "ZEROG_TESTNET_RPC_URL",
  "eip155:8453": "BASE_MAINNET_RPC_URL",
  "eip155:84532": "BASE_SEPOLIA_RPC_URL",
  "eip155:42161": "ARBITRUM_MAINNET_RPC_URL",
};

export const x402FacilitatorClient = () =>
  createMiddleware<Env>(async (c, next) => {
    const facilitator = new x402Facilitator();

    const signer = privateKeyToAccount(c.env.FACILITATOR_PRIVATE_KEY as Hex);
    const walletClients: Partial<Record<EvmChainId, EvmWalletClient>> = {};

    for (const chainId of Object.keys(SUPPORTED_EVM_CHAINS) as EvmChainId[]) {
      const rpcUrlKey = RPC_URL_BY_CHAIN[chainId];
      const rpcUrl = c.env[rpcUrlKey] as string | undefined;

      if (!rpcUrl) continue;

      const client = createEvmWalletClient(chainId, rpcUrl, signer);
      walletClients[chainId] = client;

      const facilitatorSigner = createEvmFacilitatorSigner(client);

      registerEvmExactScheme(facilitator, chainId, facilitatorSigner);
      registerEvmUptoScheme(facilitator, chainId, facilitatorSigner);
    }

    c.set("X402_FACILITATOR", facilitator);
    c.set("X402_ROUTER_ADDRESS", signer.address);
    c.set("X402_WALLET_CLIENTS", walletClients);

    return next();
  });
