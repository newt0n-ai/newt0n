import type { x402Facilitator } from "@x402/core/facilitator";
import type { FacilitatorEvmSigner } from "@x402/evm";
import { ExactEvmScheme } from "@x402/evm/exact/facilitator";
import { UptoEvmScheme } from "@x402/evm/upto/facilitator";

import type { ZeroGChain } from "../chains/0g";

export const registerZeroGExactScheme = (
  facilitator: x402Facilitator,
  chain: ZeroGChain,
  signer: FacilitatorEvmSigner
) => {
  facilitator.register(
    chain,
    new ExactEvmScheme(signer, { deployERC4337WithEIP6492: true })
  );
  // facilitator.registerV1(
  //   chain,
  //   new ExactEvmScheme(signer, { deployERC4337WithEIP6492: true })
  // );
};

export const registerZeroGUptoScheme = (
  facilitator: x402Facilitator,
  chain: ZeroGChain,
  signer: FacilitatorEvmSigner
) => {
  facilitator.register(chain, new UptoEvmScheme(signer));
  // facilitator.registerV1(chain, new UptoEvmScheme(signer));
};
