import type { PaymentOption } from "@x402/core/http";
import { zValidator } from "@hono/zod-validator";
import { decodePaymentRequiredHeader } from "@x402/core/http";
import { wrapFetchWithPayment } from "@x402/fetch";
import { paymentMiddleware } from "@x402/hono";
import { Hono } from "hono";
import { proxy } from "hono/proxy";
import { z } from "zod";

import type { SupportedNetwork } from "../config/chains";
import type { Env } from "../env";
import { SUPPORTED_NETWORKS } from "../config/chains";
import { internalServerError } from "../errors";
import { declareRouterExtension } from "../lib/x402/router-extension";

const routeHandler = new Hono<Env>();

export const PAY_TO_ENV_MAPPING = {
  "eip155:16661": "ZEROG_MAINNET_PAY_TO",
  "eip155:8453": "BASE_MAINNET_PAY_TO",
} as const satisfies Record<SupportedNetwork, string>;

type Stablecoin = {
  address: string;
  name: string;
  decimal: number;
  version: string;
  assetTransferMethod?: "permit2";
  supportsEip2612?: true;
};

export const NETWORK_TOKEN_MAPPING = {
  "eip155:16661": {
    address: "0x1f3aa82227281ca364bfb3d253b0f1af1da6473e",
    decimal: 6,
    name: "Bridged USDC",
    version: "2",
  },
  "eip155:8453": {
    address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    decimal: 6,
    name: "USD Coin",
    version: "2",
  },
} as const satisfies Record<SupportedNetwork, Stablecoin>;

routeHandler.all(
  "/",
  zValidator(
    "query",
    z.object({
      url: z.url(),
    })
  ),
  async (c, next) => {
    const x402Server = c.get("X402_SERVER");
    const { url } = c.req.valid("query");

    const proxyResponse = await proxy(url, c.req);
    if (proxyResponse.ok) return proxyResponse;

    if (!proxyResponse.ok && proxyResponse.status !== 402) return proxyResponse;

    const decodedPaymentRequiredHeader =
      proxyResponse.headers.get("payment-required");
    if (!decodedPaymentRequiredHeader) return proxyResponse;

    const paymentRequired = decodePaymentRequiredHeader(
      decodedPaymentRequiredHeader
    );

    const matchingRequirement = paymentRequired.accepts.find((req) =>
      Object.values(NETWORK_TOKEN_MAPPING).some(
        (token) => token.address.toLowerCase() === req.asset.toLowerCase()
      )
    );

    if (!matchingRequirement) return proxyResponse;

    const accepts: PaymentOption[] = SUPPORTED_NETWORKS.map((network) => ({
      scheme: "exact" as const,
      network,
      payTo: c.env[PAY_TO_ENV_MAPPING[network]],
      price: {
        asset: NETWORK_TOKEN_MAPPING[network].address,
        amount: matchingRequirement.amount,
        extra: {
          name: NETWORK_TOKEN_MAPPING[network].name,
          version: NETWORK_TOKEN_MAPPING[network].version,
        },
      },
    }));

    return paymentMiddleware(
      {
        accepts,
        description: paymentRequired.resource.description,
        mimeType: paymentRequired.resource.mimeType,
        resource: url,
        extensions: {
          ...declareRouterExtension({ url }),
        },
      },
      x402Server
    )(c, next);
  },
  async (c) => {
    try {
      const x402Client = c.get("X402_CLIENT");

      const fetchWithPayment = wrapFetchWithPayment(fetch, x402Client);

      const { url } = c.req.valid("query");
      const response = await fetchWithPayment(url);

      return response;
    } catch (err) {
      console.error({
        error: err instanceof Error ? err.name : "UnknownError",
      });

      return c.json(internalServerError, 500);
    }
  }
);

export { routeHandler };
