import {
  HTTPFacilitatorClient,
  x402ResourceServer as X402Server,
} from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { UptoEvmScheme } from "@x402/evm/upto/server";
import { createMiddleware } from "hono/factory";

import type { Env } from "../env";
import { SUPPORTED_NETWORKS } from "../config/chains";
import { createRouterExtension } from "../lib/x402/router-extension";

export type X402ServerVariables = {
  X402_SERVER: X402Server;
};

export const x402ServerMiddleware = () =>
  createMiddleware<Env>(async (c, next) => {
    const facilitatorClient = new HTTPFacilitatorClient({
      url: c.env.FACILITATOR_URL,
    });
    const x402Server = new X402Server(facilitatorClient);

    SUPPORTED_NETWORKS.forEach((network) => {
      x402Server.register(network, new ExactEvmScheme());
      x402Server.register(network, new UptoEvmScheme());
    });

    x402Server.registerExtension(createRouterExtension());

    c.set("X402_SERVER", x402Server);

    return next();
  });
