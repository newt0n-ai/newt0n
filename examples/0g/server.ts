import { HTTPFacilitatorClient } from "@x402/core/server";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { Hono } from "hono";
import { logger } from "hono/logger";

import { ExactEvmScheme } from "@spaceobject/x402/server";

const app = new Hono();
const evmAddress = process.env.ZEROG_RECIPIENT_ADDRESS!;
const facilitatorUrl =
  process.env.FACILITATOR_URL ?? "https://facilitator.spaceobject.xyz";

const facilitatorClient = new HTTPFacilitatorClient({
  url: facilitatorUrl,
});

app.use(logger());

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
      new ExactEvmScheme()
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
