# @heraldprotocol/x402

JavaScript SDK for the [heraldprotocol](https://github.com/heraldprotocol/protocol) x402 protocol on the 0G network.

## Installation

```sh
# npm
npm install @heraldprotocol/x402

# pnpm
pnpm add @heraldprotocol/x402

# yarn
yarn add @heraldprotocol/x402

# bun
bun add @heraldprotocol/x402
```

## Modules

### `@heraldprotocol/x402/server`

Server-side helpers for sellers to integrate [x402](https://github.com/x402-foundation/x402) micropayments, preconfigured for 0G networks.

#### `ExactEvmScheme`

Drop-in replacement for `@x402/evm`'s `ExactEvmScheme`. Adds a money parser that resolves human-readable prices (e.g. `"$0.001"`) to the correct token amount for 0G's default stablecoin per network — so you can price endpoints in USD without hardcoding decimals or token addresses.

Register it on your `x402ResourceServer` for the 0G network you target:

```ts
import { ExactEvmScheme } from "@heraldprotocol/x402/server";

new x402ResourceServer(facilitator).register(
  "eip155:16661",
  new ExactEvmScheme()
);
```

That's the only heraldprotocol-specific wiring. Everything else — the facilitator client, `paymentMiddleware`, route definitions — is standard x402. See the [x402 docs](https://github.com/x402-foundation/x402) for framework adapters (Hono, Express, Next.js, etc.).

A full end-to-end Hono example lives at [`examples/server`](../../../examples/server/index.ts).

## Supported networks

| Network        | Chain ID             | Default Asset     | Symbol    | Address                                      |
| -------------- | -------------------- | ----------------- | --------- | -------------------------------------------- |
| `eip155:16661` | 0G Mainnet           | Bridged USDC      | USDC.e    | `0x1f3aa82227281ca364bfb3d253b0f1af1da6473e` |
| `eip155:16602` | 0G Galileo Testnet   | -                 | -         | -                                            |

> 0G testnet has no official stablecoin yet. This table will be updated once one is available.

## Requirements

- Node.js 18+ (or any runtime with WebCrypto + `fetch`)

## License

MIT
