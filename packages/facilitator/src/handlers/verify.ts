import type { PaymentPayload, PaymentRequirements } from "@x402/core/types";
import {
  parsePaymentPayload,
  parsePaymentRequirements,
} from "@x402/core/schemas";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { erc20Abi } from "viem";

import type { Env } from "../env";
import { internalServerError } from "../errors";
import {
  isRouteError,
  parseRouter,
  resolveRoute,
  STABLECOIN_REGISTRY,
} from "../lib/x402/router";

const verifyHandler = new Hono<Env>();

verifyHandler.post(
  "/",
  validator("json", (value, c) => {
    const { paymentPayload, paymentRequirements } = value;

    const resolvedPaymentPayload = parsePaymentPayload(paymentPayload);
    if (!resolvedPaymentPayload.success)
      return c.json(resolvedPaymentPayload.error, 400);

    const resolvedPaymentRequirements =
      parsePaymentRequirements(paymentRequirements);
    if (!resolvedPaymentRequirements.success)
      return c.json(resolvedPaymentRequirements.error, 400);

    return {
      paymentPayload: resolvedPaymentPayload.data,
      paymentRequirements: resolvedPaymentRequirements.data,
    };
  }),
  async (c) => {
    try {
      const { paymentPayload, paymentRequirements } = c.req.valid("json");

      const route = parseRouter(paymentRequirements as PaymentRequirements);

      if (!route) {
        const verifyResponse = await c.var.X402_FACILITATOR.verify(
          paymentPayload as PaymentPayload,
          paymentRequirements as PaymentRequirements
        );
        return c.json(verifyResponse, 200);
      }

      const resolved = resolveRoute(paymentRequirements as PaymentRequirements);

      if (isRouteError(resolved)) {
        return c.json(
          {
            isValid: false,
            invalidReason: resolved.error,
            invalidMessage: "reason" in resolved ? resolved.reason : undefined,
          },
          200
        );
      }

      if (
        (paymentPayload as PaymentPayload).accepted.network !== resolved.src
      ) {
        return c.json(
          {
            isValid: false,
            invalidReason: "invalid_network",
            invalidMessage: `payload network must be ${resolved.src} for routed payment`,
          },
          200
        );
      }

      const routerAddress = c.var.X402_ROUTER_ADDRESS;

      const srcRequirements: PaymentRequirements = {
        ...(paymentRequirements as PaymentRequirements),
        network: resolved.src,
        asset: STABLECOIN_REGISTRY[resolved.src].address,
        payTo: routerAddress,
      };

      const verifyResponse = await c.var.X402_FACILITATOR.verify(
        paymentPayload as PaymentPayload,
        srcRequirements
      );

      if (!verifyResponse.isValid) return c.json(verifyResponse, 200);

      const dstClient = c.var.X402_WALLET_CLIENTS[resolved.dst];

      if (!dstClient) {
        return c.json(
          {
            isValid: false,
            invalidReason: "unsupported_route",
            invalidMessage: `no client configured for destination ${resolved.dst}`,
          },
          200
        );
      }

      const balance = await dstClient.readContract({
        address: resolved.asset.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [routerAddress],
      });

      if (balance < BigInt(resolved.amount)) {
        return c.json(
          { isValid: false, invalidReason: "insufficient_liquidity" },
          200
        );
      }

      return c.json(verifyResponse, 200);
    } catch (err) {
      console.error({
        error: err instanceof Error ? err.name : "UnknownError",
      });

      return c.json(internalServerError, 500);
    }
  }
);

export { verifyHandler };
