import type { Hex } from "viem";
import { x402Client as X402Client } from "@x402/core/client";
import { ExactEvmScheme, UptoEvmScheme } from "@x402/evm";
import { createMiddleware } from "hono/factory";
import { privateKeyToAccount } from "viem/accounts";

import type { SupportedNetwork } from "../config/chains";
import type { Env } from "../env";
import { SUPPORTED_EVM_NETWORKS } from "../config/chains";

export type X402ClientVariables = {
  X402_CLIENT: X402Client;
};

export const PRIVATE_KEY_ENV_MAPPING = {
  "eip155:16661": "ZEROG_MAINNET_PRIVATE_KEY",
  "eip155:8453": "BASE_MAINNET_PRIVATE_KEY",
} as const satisfies Record<SupportedNetwork, string>;

export const x402ClientMiddleware = () =>
  createMiddleware<Env>(async (c, next) => {
    const x402Client = new X402Client();

    SUPPORTED_EVM_NETWORKS.forEach((network) => {
      const pk = c.env[PRIVATE_KEY_ENV_MAPPING[network]];
      const signer = privateKeyToAccount(pk as Hex);

      x402Client.register(network, new ExactEvmScheme(signer));
      x402Client.register(network, new UptoEvmScheme(signer));
    });

    c.set("X402_CLIENT", x402Client);

    return next();
  });
