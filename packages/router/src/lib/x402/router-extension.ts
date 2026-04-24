import type { ResourceServerExtension, SettleResponse } from "@x402/core/types";

export const ROUTER_EXTENSION = "spaceobject-router";

export type RouterExtensionDeclaration = {
  url: string;
};

export type TransportContext = {
  responseHeaders: {
    "payment-response": string;
  };
};

export const createRouterExtension = (): ResourceServerExtension => ({
  key: ROUTER_EXTENSION,

  enrichSettlementResponse: async (declaration, context) => {
    const { url } = declaration as RouterExtensionDeclaration;
    const { responseHeaders } = context.transportContext as TransportContext;

    const settleResponse = JSON.parse(
      atob(responseHeaders["payment-response"])
    ) as SettleResponse;

    return { url, ...settleResponse };
  },
});

export const declareRouterExtension = (
  declaration: RouterExtensionDeclaration
) => {
  return {
    [ROUTER_EXTENSION]: declaration,
  };
};
