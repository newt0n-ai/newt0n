import type { Hex } from "viem";
import { x402Facilitator } from "@x402/core/facilitator";
import { createMiddleware } from "hono/factory";
import { privateKeyToAccount } from "viem/accounts";

import type { Env } from "../env";
import {
  createZeroGWalletClient,
  zeroGMainnetNetworkId,
  zeroGTestnetNetworkId,
} from "../lib/chains/0g";
import {
  registerZeroGExactScheme,
  registerZeroGUptoScheme,
} from "../lib/x402/scheme";
import { createZeroGFacilitatorSigner } from "../lib/x402/signer";

export type X402FacilitatorClientVariables = {
  X402_FACILITATOR: x402Facilitator;
};

export const x402FacilitatorClient = () =>
  createMiddleware<Env>(async (c, next) => {
    const facilitator = new x402Facilitator();

    const signer = privateKeyToAccount(c.env.FACILITATOR_PRIVATE_KEY as Hex);

    const mainnetClient = createZeroGWalletClient(
      zeroGMainnetNetworkId,
      c.env.ZEROG_MAINNET_RPC_URL,
      signer
    );
    const testnetClient = createZeroGWalletClient(
      zeroGTestnetNetworkId,
      c.env.ZEROG_TESTNET_RPC_URL,
      signer
    );

    const mainnetFacilitatorSigner =
      createZeroGFacilitatorSigner(mainnetClient);
    const testnetFacilitatorSigner =
      createZeroGFacilitatorSigner(testnetClient);

    registerZeroGExactScheme(
      facilitator,
      zeroGMainnetNetworkId,
      mainnetFacilitatorSigner
    );
    registerZeroGUptoScheme(
      facilitator,
      zeroGMainnetNetworkId,
      mainnetFacilitatorSigner
    );

    registerZeroGExactScheme(
      facilitator,
      zeroGTestnetNetworkId,
      testnetFacilitatorSigner
    );
    registerZeroGUptoScheme(
      facilitator,
      zeroGTestnetNetworkId,
      testnetFacilitatorSigner
    );

    c.set("X402_FACILITATOR", facilitator);

    return next();
  });
