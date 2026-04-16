import type { Chain, PrivateKeyAccount } from "viem";
import { createWalletClient, http, publicActions } from "viem";
import { zeroGMainnet, zeroGTestnet } from "viem/chains";

export const zeroGMainnetNetworkId = `eip155:${zeroGMainnet.id}` as const;
export const zeroGTestnetNetworkId = `eip155:${zeroGTestnet.id}` as const;
export const zeroGChains = [
  zeroGMainnetNetworkId,
  zeroGTestnetNetworkId,
] as const;
export type ZeroGChain = (typeof zeroGChains)[number];

export const ZERO_GRAVITY_CHAIN_MAPPING = {
  "eip155:16661": zeroGMainnet,
  "eip155:16602": zeroGTestnet,
} satisfies Record<ZeroGChain, Chain>;

export const createZeroGWalletClient = (
  chain: ZeroGChain,
  rpcUrl: string,
  account: PrivateKeyAccount
) => {
  const _chain = ZERO_GRAVITY_CHAIN_MAPPING[chain];

  const viemClient = createWalletClient({
    account,
    chain: _chain,
    transport: http(rpcUrl),
  }).extend(publicActions);

  return viemClient;
};
export type ZeroGWalletClient = ReturnType<typeof createZeroGWalletClient>;
