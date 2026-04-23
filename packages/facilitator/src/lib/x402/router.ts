import type { PaymentRequirements } from "@x402/core/types";

export type Stablecoin = {
  address: string;
  name: string;
  version: string;
  decimal: number;
};

export const STABLECOIN_REGISTRY = {
  "eip155:16661": {
    address: "0x1dC524F2bF5e4516c0Db1F13b08B1eD4A4D5E9D2",
    name: "Bridged USDC",
    decimal: 6,
    version: "2",
  },
  "eip155:16602": {
    address: "0xb5e72b64A0A1e7e7F08C1D0FF72BbFC1AC2f577D",
    name: "Bridged USDC",
    decimal: 6,
    version: "2",
  },
  "eip155:8453": {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    name: "USD Coin",
    decimal: 6,
    version: "2",
  },
  "eip155:84532": {
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    name: "USD Coin",
    decimal: 6,
    version: "2",
  },
  "eip155:42161": {
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    name: "USD Coin",
    decimal: 6,
    version: "2",
  },
} as const satisfies Record<string, Stablecoin>;

export type StablecoinChainId = keyof typeof STABLECOIN_REGISTRY;

export type Route = {
  from: StablecoinChainId;
};

export type ResolvedRoute = {
  src: StablecoinChainId;
  dst: StablecoinChainId;
  amount: string;
  asset: Stablecoin;
};

export type RouteError =
  | { error: "unsupported_route"; reason: string }
  | { error: "insufficient_liquidity" };

function isStablecoinChainId(id: string): id is StablecoinChainId {
  return id in STABLECOIN_REGISTRY;
}

export function parseRouter(
  paymentRequirements: PaymentRequirements
): Route | null {
  const spaceobject = (paymentRequirements.extra as Record<string, unknown>)
    ?.spaceobject;
  if (!spaceobject || typeof spaceobject !== "object") return null;

  const routeRaw = (spaceobject as Record<string, unknown>).route;
  if (!routeRaw || typeof routeRaw !== "object") return null;

  const from = (routeRaw as Record<string, unknown>).from;
  if (typeof from !== "string") return null;

  if (!isStablecoinChainId(from)) return null;

  return { from };
}

export function resolveRoute(
  paymentRequirements: PaymentRequirements
): ResolvedRoute | RouteError {
  const parsed = parseRouter(paymentRequirements);
  if (!parsed) {
    return {
      error: "unsupported_route",
      reason: "missing or invalid extra.spaceobject.route",
    };
  }

  const src = parsed.from;
  const dst = paymentRequirements.network;

  if (!isStablecoinChainId(dst)) {
    return {
      error: "unsupported_route",
      reason: `destination network ${dst} not in registry`,
    };
  }

  return {
    src,
    dst,
    amount: paymentRequirements.amount,
    asset: STABLECOIN_REGISTRY[dst],
  };
}

export function isRouteError(
  result: ResolvedRoute | RouteError
): result is RouteError {
  return "error" in result;
}
