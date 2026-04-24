<div align="center">
  <img width="80%" height="auto" src="assets/heraldprotocol.png" />

  <hr/>
  
  <p align="center">
    <a href="https://heraldprotocol.xyz/"><img alt="Website" src="https://img.shields.io/badge/website-heraldprotocol.xyz-1a1a1a" /></a>
    <a href="https://docs.heraldprotocol.xyz/"><img alt="Docs" src="https://img.shields.io/badge/docs-read%20the%20docs-blue" /></a>
    <a href="https://x.com/herald_protocol"><img alt="X" src="https://img.shields.io/twitter/follow/herald_protocol" /></a>
  </p>
</div>

## Herald Protocol

Herald Protocol is the infrastructure for the **agentic economy on 0G Chain**.

AI agents need to pay and get paid without humans in the loop. Herald ships the economic rails so agents can transact with other agents, APIs, and services natively on 0G.

## Live on 0G Mainnet

**Agent payments are live on 0G Chain**, powered by [x402](https://x402.org) as the first supported rail. Any API, MCP server, or AI agent can accept onchain payments through our facilitator — no middlemen, no off-chain escrow, just HTTP + settlement on 0G.

- **Facilitator URL:** https://facilitator.heraldprotocol.xyz/
- **Supported token:** USDC.e — swap via [hub.0g.ai](https://hub.0g.ai/swap?network=mainnet)
- **Drop-in compatible** with the x402 spec — plug it into any HTTP server or agent client

> There's no official USDC testnet on 0G right now, which makes the dev loop painful. We're shipping our own EIP-3009-compatible test token so you can build and test x402 flows end-to-end. We're also wiring up Permit2 so any ERC-20 can be used as a payment token, not just EIP-3009 ones. Landing soon.

## Cross-Chain Payment Router

Not every service accepts payment on 0G. The **Herald Router** bridges that gap: agents hold funds on 0G and pay any x402-protected service across supported routes, without juggling multiple chains or bridging manually.

- Pay from 0G, settle wherever the service lives
- One wallet, one balance, multiple destination chains
- Same x402 interface — the router handles the cross-chain mechanics

## Roadmap

- **Permit2 gas sponsoring** — accept any ERC-20 as payment, no native token required from the payer
- **More payment rails** — additional settlement protocols beyond x402, so agents can pay however the counterparty expects
- **EIP-3009 test token on 0G** — unblock the dev loop until an official USDC testnet lands
- **[mpp](https://mpp.dev) support** — native integration with the machine payment protocol for broader agent-to-agent payment interoperability

## Why 0G?

0G is an EVM-compatible L1 with sub-second finality, decentralized storage, and a compute marketplace — a natural home for agent-native apps. Herald gives those agents the economic rails to transact and get paid from day one.

## Links

- Website: https://heraldprotocol.xyz
- Docs: https://docs.heraldprotocol.xyz
- X: https://x.com/herald_protocol
