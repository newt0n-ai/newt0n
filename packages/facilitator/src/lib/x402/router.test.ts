import type { PaymentRequirements } from "@x402/core/types";
import { describe, expect, it } from "vitest";

import {
  isRouteError,
  parseRouter,
  resolveRoute,
  STABLECOIN_REGISTRY,
} from "./router";

const baseReq: PaymentRequirements = {
  scheme: "exact",
  network: "eip155:8453",
  amount: "1000000",
  payTo: "0x1234000000000000000000000000000000000000",
  maxTimeoutSeconds: 60,
  asset: STABLECOIN_REGISTRY["eip155:8453"].address,
  extra: {
    name: STABLECOIN_REGISTRY["eip155:8453"].name,
    version: STABLECOIN_REGISTRY["eip155:8453"].version,
  },
};

describe("parseRouter", () => {
  it("returns null when extra is empty", () => {
    expect(parseRouter(baseReq)).toBeNull();
  });

  it("returns null when spaceobject.route is missing", () => {
    expect(
      parseRouter({ ...baseReq, extra: { ...baseReq.extra, spaceobject: {} } })
    ).toBeNull();
  });

  it("returns null when from is not a supported chain", () => {
    expect(
      parseRouter({
        ...baseReq,
        extra: {
          ...baseReq.extra,
          spaceobject: { route: { from: "eip155:1" } },
        },
      })
    ).toBeNull();
  });

  it("returns route when valid", () => {
    const result = parseRouter({
      ...baseReq,
      extra: {
        ...baseReq.extra,
        spaceobject: { route: { from: "eip155:16661" } },
      },
    });
    expect(result).toEqual({ from: "eip155:16661" });
  });
});

describe("resolveRoute", () => {
  const routedReq: PaymentRequirements = {
    ...baseReq,
    network: "eip155:8453",
    extra: {
      ...baseReq.extra,
      spaceobject: { route: { from: "eip155:16661" } },
    },
  };

  it("resolves 0G → Base", () => {
    const result = resolveRoute(routedReq);
    expect(isRouteError(result)).toBe(false);
    if (!isRouteError(result)) {
      expect(result.src).toBe("eip155:16661");
      expect(result.dst).toBe("eip155:8453");
      expect(result.amount).toBe("1000000");
      expect(result.asset).toEqual(STABLECOIN_REGISTRY["eip155:8453"]);
    }
  });

  it("resolves Base → 0G testnet", () => {
    const result = resolveRoute({
      ...baseReq,
      network: "eip155:16602",
      extra: {
        ...baseReq.extra,
        spaceobject: { route: { from: "eip155:8453" } },
      },
    });
    expect(isRouteError(result)).toBe(false);
    if (!isRouteError(result)) {
      expect(result.src).toBe("eip155:8453");
      expect(result.dst).toBe("eip155:16602");
      expect(result.asset).toEqual(STABLECOIN_REGISTRY["eip155:16602"]);
    }
  });

  it("resolves Base → Arbitrum", () => {
    const result = resolveRoute({
      ...baseReq,
      network: "eip155:42161",
      extra: {
        ...baseReq.extra,
        spaceobject: { route: { from: "eip155:8453" } },
      },
    });
    expect(isRouteError(result)).toBe(false);
    if (!isRouteError(result)) {
      expect(result.src).toBe("eip155:8453");
      expect(result.dst).toBe("eip155:42161");
    }
  });

  it("returns unsupported_route when no extra.spaceobject", () => {
    const result = resolveRoute(baseReq);
    expect(isRouteError(result)).toBe(true);
    if (isRouteError(result)) {
      expect(result.error).toBe("unsupported_route");
    }
  });

  it("returns unsupported_route when destination not in registry", () => {
    const result = resolveRoute({
      ...baseReq,
      network: "eip155:1",
      extra: {
        ...baseReq.extra,
        spaceobject: { route: { from: "eip155:16661" } },
      },
    });
    expect(isRouteError(result)).toBe(true);
    if (isRouteError(result)) {
      expect(result.error).toBe("unsupported_route");
    }
  });

  it("returns unsupported_route when source not in registry", () => {
    const result = resolveRoute({
      ...baseReq,
      extra: { ...baseReq.extra, spaceobject: { route: { from: "eip155:1" } } },
    });
    expect(isRouteError(result)).toBe(true);
    if (isRouteError(result)) {
      expect(result.error).toBe("unsupported_route");
    }
  });
});
