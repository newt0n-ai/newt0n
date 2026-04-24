# 0G Example

Demonstrates x402 pay-per-request on the [0G network](https://0g.ai) using Spaceobject's facilitator.

A Hono server exposes a `/weather` endpoint that requires a `$0.001` payment per request. The client wraps `fetch` to handle payment automatically.

## Setup

```bash
bun install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `FACILITATOR_URL` | URL of the x402 facilitator (e.g. `https://facilitator.spaceobject.xyz`) |
| `ZEROG_RECIPIENT_ADDRESS` | EVM address that receives payments |
| `ZEROG_PRIVATE_KEY` | Private key of the wallet making payments |

## Run

Start the server:

```bash
bun run server.ts
```

In a separate terminal, run the client:

```bash
bun run client.ts
```

The client calls `GET /weather`, pays automatically via x402, and prints the response and payment receipt.

## Why `ExactEvmScheme` from `@spaceobject/x402/server`

The upstream `@x402/evm` library has no built-in knowledge of 0G's network (`eip155:16661`). `@spaceobject/x402/server` extends it with a money parser that maps dollar amounts to the correct token contract (Bridged USDC at `0x1f3aa82227281ca364bfb3d253b0f1af1da6473e`) and supplies the EIP-712 domain parameters needed to verify permit signatures. Without it, the resource server cannot resolve or validate payments on 0G.
