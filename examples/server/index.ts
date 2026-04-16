import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();
const evmAddress = "0xYourEvmAddress";

const facilitatorClient = new HTTPFacilitatorClient({
  url: "http://facilitator.newt0n.ai",
});

app.use(logger());

const zeroGExactScheme = new ExactEvmScheme();
zeroGExactScheme.registerMoneyParser(
  async (amount: number, _network: string) => {
    const tokenAmount = Math.floor(amount * 1_000_000).toString();

    return {
      amount: tokenAmount,
      asset: "0x1f3aa82227281ca364bfb3d253b0f1af1da6473e",
      extra: {
        name: "Bridged USDC",
        version: "2",
      },
    };
  }
);

app.use(
  paymentMiddleware(
    {
      "GET /weather": {
        accepts: [
          {
            scheme: "exact",
            price: "$0.001",
            network: "eip155:16661",
            payTo: evmAddress,
          },
        ],
        description: "Weather data",
        mimeType: "application/json",
      },
    },
    new x402ResourceServer(facilitatorClient).register(
      "eip155:16661",
      zeroGExactScheme
    )
  )
);

app.get("/weather", (c) => {
  return c.json({
    report: {
      weather: "sunny",
      temperature: 70,
    },
  });
});

export default app;
