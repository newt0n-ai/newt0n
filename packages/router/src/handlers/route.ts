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

const routeHandler = new Hono<Env>();

export const PAY_TO_ENV_MAPPING = {
  "eip155:16661": "ZEROG_MAINNET_PAY_TO",
  "eip155:16602": "ZEROG_TESTNET_PAY_TO",
  "eip155:8453": "BASE_MAINNET_PAY_TO",
  "eip155:84532": "BASE_SEPOLIA_PAY_TO",
} as const satisfies Record<SupportedNetwork, string>;

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

    return paymentMiddleware(
      {
        accepts: SUPPORTED_NETWORKS.reduce((acc, network) => {
          const exact = paymentRequired.accepts.find(
            (accept) => accept.scheme === "exact" && accept.network === network
          );
          if (exact)
            acc.push({
              scheme: "exact",
              network,
              payTo: c.env[PAY_TO_ENV_MAPPING[network]],
              price: {
                asset: exact.asset,
                amount: exact.amount,
                extra: exact.extra,
              },
              maxTimeoutSeconds: exact.maxTimeoutSeconds,
              extra: exact.extra,
            });

          const upto = paymentRequired.accepts.find(
            (accept) => accept.scheme === "upto" && accept.network === network
          );
          if (upto)
            acc.push({
              scheme: "upto",
              network,
              payTo: c.env[PAY_TO_ENV_MAPPING[network]],
              price: {
                asset: upto.asset,
                amount: upto.amount,
                extra: upto.extra,
              },
              maxTimeoutSeconds: upto.maxTimeoutSeconds,
              extra: upto.extra,
            });

          return acc;
        }, [] as PaymentOption[]),
        description: paymentRequired.resource.description,
        mimeType: paymentRequired.resource.mimeType,
        resource: paymentRequired.resource.url,
      },
      x402Server
    )(c, next);
  },
  async (c) => {
    try {
      const x402Client = c.get("X402_CLIENT");

      const fetchWithPayment = wrapFetchWithPayment(fetch, x402Client);

      const { url } = c.req.valid("query");

      const response = await fetchWithPayment(url, c.req.raw);

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
