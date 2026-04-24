export const SUPPORTED_EVM_NETWORKS = ["eip155:16661", "eip155:8453"] as const;
export type SupportedEvmNetwork = (typeof SUPPORTED_EVM_NETWORKS)[number];

export const SUPPORTED_NETWORKS = SUPPORTED_EVM_NETWORKS;
export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];
