<div align="center">
  <img width="80%" height="auto" src="assets/heraldprotocol.png" />

  <hr/>
  
  <p align="center">
    <a href="https://heraldprotocol.xyz/"><img alt="Website" src="https://img.shields.io/badge/website-heraldprotocol.xyz-1a1a1a" /></a>
    <a href="https://docs.heraldprotocol.xyz/"><img alt="Docs" src="https://img.shields.io/badge/docs-read%20the%20docs-blue" /></a>
    <a href="https://x.com/heraldprotocol_xyz"><img alt="X" src="https://img.shields.io/twitter/follow/heraldprotocol_xyz" /></a>
  </p>
</div>

## Herald Protocol

Herald Protocol is the agent discovery and trust layer for **0G Chain**.

We're shipping the infrastructure for open-ended agent economies on 0G, where AI agents can be found, evaluated, and paid without pre-existing trust.

## Live on 0G Mainnet

**x402 is now live on 0G Chain.** Any API, MCP server, or AI agent can accept payments directly on 0G via x402 through our facilitator. No middlemen, no off-chain escrow — just HTTP + onchain settlement.

- **Facilitator URL:** https://facilitator.heraldprotocol.xyz/
- **Supported token:** USDC.e — swap via [hub.0g.ai](https://hub.0g.ai/swap?network=mainnet)
- **Drop-in compatible** with the x402 spec — plug it into any HTTP server or agent client

> There's no official USDC testnet on 0G right now, which makes the dev loop painful. We're shipping our own EIP-3009-compatible test token so you can build and test x402 flows end-to-end. We're also wiring up Permit2 so any ERC-20 can be used as a payment token, not just EIP-3009 ones. Landing soon.

## Roadmap

- **Permit2 gas sponsoring** — accept any ERC-20 as payment, no native token required from the payer
- **ERC-8004 on 0G** — Identity (ERC-721 + 0G Storage), Reputation (onchain feedback), Validation (zkML, TEE attestation, stake-secured re-execution)
- **INFT (ERC-7857) × ERC-8004** — verifiable, transferable agent assets composed with the trust layer

## Why 0G?

0G is an EVM-compatible L1 with sub-second finality, decentralized storage, and a compute marketplace — a natural home for agent-native apps. Herald Protocol makes those agents discoverable, trustable, and monetizable from day one.

## Repository

- [`packages/facilitator`](./packages/facilitator) — x402 facilitator service
- [`packages/sdk`](./packages/sdk) — client SDK

- [`examples/server`](./examples/server) — example x402-protected server
- [`examples/client`](./examples/client) — example paying client

## Links

- Website: https://heraldprotocol.xyz
- Docs: https://docs.heraldprotocol.xyz
- X: https://x.com/heraldprotocol_xyz
