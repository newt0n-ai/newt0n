<script lang="ts">
import { onMount } from "svelte";

// biome-ignore lint/correctness/noUnusedImports: used in template
import background from "$lib/assets/background.webp";
// biome-ignore lint/correctness/noUnusedImports: used in template
import logo from "$lib/assets/logo.png";

onMount(() => {
  const bg = document.querySelector<HTMLElement>("[data-bg-layer]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopMq = window.matchMedia("(min-width: 768px)");
  let ticking = false;

  function update() {
    if (!bg) return;

    if (reducedMotion.matches || !desktopMq.matches) {
      bg.style.backgroundPosition = "center 30%";
      ticking = false;
      return;
    }

    bg.style.backgroundPosition = `center calc(50% - ${window.scrollY * 0.3}px)`;
    ticking = false;
  }

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });

  const els = document.querySelectorAll("[data-enter]");
  let io: IntersectionObserver | null = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -25% 0px" }
    );
    els.forEach((el) => {
      io?.observe(el);
    });
  } else {
    els.forEach((el) => {
      el.classList.add("is-in");
    });
  }

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", update);
    io?.disconnect();
  };
});
</script>

<svelte:head>
  <title>Herald Protocol — Payment Infrastructure for AI Agents</title>
</svelte:head>

<div
  data-bg-layer
  aria-hidden="true"
  class="fixed inset-0 -z-10 bg-no-repeat brightness-[0.2] will-change-[background-position] bg-cover bg-center"
  style="background-image: url({background});"
></div>

<header
  data-enter
  class="relative z-2 flex items-center justify-between px-6 py-5 md:py-7 md:px-[clamp(1.5rem,8vw,8rem)] opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
>
  <a
    href="/"
    aria-label="Herald Protocol"
    class="inline-flex items-center gap-[0.65rem] no-underline"
  >
    <img
      class="block w-9 h-9 md:w-16 md:h-16 [image-rendering:pixelated]"
      src={logo}
      alt=""
    />
    <span
      class="font-mono font-black md:text-xl tracking-[0.18em] uppercase text-heading"
      >Herald Pr0t0c0l</span
    >
  </a>
  <a
    href="https://docs.heraldprotocol.xyz/"
    target="_blank"
    rel="noopener"
    class="font-sans font-medium text-xs tracking-[0.15em] uppercase text-muted no-underline transition-[color,opacity] duration-120 ease-out hover:text-heading active:opacity-50 focus-visible:outline-2 focus-visible:outline-line focus-visible:outline-offset-[3px] focus-visible:rounded-[1px]"
    >Docs ↗</a
  >
</header>

<section
  data-screen-label="01 Hero"
  class="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] px-6 md:px-[clamp(1.5rem,8vw,8rem)] flex flex-col relative"
>
  <div
    aria-hidden="true"
    class="flex-[0_1_22vh] md:flex-[0_1_15vh] min-h-10"
  ></div>

  <div
    data-enter
    class="flex-none pb-9 max-w-300 opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
  >
    <div class="flex items-center gap-[0.9rem] mb-[1.6rem]">
      <span
        class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
        >Live on mainnet</span
      >
      <span aria-hidden="true" class="block w-7 h-px bg-line"></span>
    </div>

    <h1
      class="m-0 mb-[1.6rem] font-mono font-bold text-[clamp(2.6rem,11vw,4.5rem)] md:text-[clamp(4rem,8vw,9rem)] leading-[0.98] tracking-[-0.02em] uppercase text-heading"
    >
      Payment infrastructure<br />
      for <span class="text-accent">AI&nbsp;agents</span>
    </h1>
  </div>

  <div
    data-enter
    aria-hidden="true"
    class="flex justify-between gap-8 flex-wrap mt-4 mb-8 opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-120 will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
  >
    <span
      class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
      >x402</span
    >
    <span
      class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
      >0G</span
    >
  </div>
</section>

<section
  data-screen-label="02 What We Are"
  class="py-[clamp(8rem,14vh,14rem)] px-6 md:px-[clamp(1.5rem,8vw,8rem)]"
>
  <div
    class="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-8 md:gap-[clamp(2rem,6vw,6rem)] items-start max-w-350"
  >
    <aside
      data-enter
      class="static md:sticky md:top-8 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-[0.9rem] opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
    >
      <span
        class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.6]"
        >Infrastructure</span
      >
    </aside>

    <div class="flex flex-col gap-0">
      <h2
        data-enter
        class="m-0 mb-10 font-mono font-bold text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-[-0.015em] uppercase text-heading opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-[60ms] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
      >
        What we are
      </h2>

      <p
        data-enter
        class="m-0 font-sans font-normal text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.75] text-fg max-w-[65ch] opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-120 will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
      >
        Herald Protocol is the infrastructure layer for autonomous agent
        economics, operating exclusively on the
        <a
          href="https://0g.ai"
          target="_blank"
          rel="noopener"
          class="text-accent font-bold no-underline border-b border-line transition-[opacity,border-color] duration-120 ease-out hover:opacity-70 active:opacity-50"
          >0G Chain</a
        >. We provide the settlement primitives that allow AI agents to meter,
        charge, and pay for digital resources at scale.
      </p>

      <p
        data-enter
        class="mt-[1.4rem] font-sans font-normal text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.75] text-fg max-w-[65ch] opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-180 will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
      >
        We ship an x402 facilitator so any API, MCP server, or agent can accept
        onchain payments on 0G, and a cross-chain payment router so agents
        holding funds on 0G can pay services on other chains without managing
        multiple wallets.
      </p>

      <dl
        data-enter
        class="mt-12 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-10 gap-y-6 border-t border-line pt-[1.6rem] opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-240 will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
      >
        <div>
          <dt
            class="font-sans font-medium text-[0.7rem] tracking-[0.15em] uppercase text-muted mb-[0.35rem]"
          >
            x402 Facilitator
          </dt>
          <dd
            class="m-0 font-mono font-medium text-[0.9rem] leading-[1.4] text-heading break-words"
          >
            <a
              target="_blank"
              href="https://facilitator.heraldprotocol.xyz"
              class="group inline-flex items-center gap-[0.6rem] font-mono font-medium text-[0.85rem] text-heading no-underline tracking-[0.02em] transition-opacity duration-120 ease-out hover:opacity-70 active:opacity-50"
              >facilitator.heraldprotocol.xyz</a
            >
          </dd>
        </div>
        <div>
          <dt
            class="font-sans font-medium text-[0.7rem] tracking-[0.15em] uppercase text-muted mb-[0.35rem]"
          >
            Router
          </dt>
          <dd
            class="m-0 font-mono font-medium text-[0.9rem] leading-[1.4] text-heading break-words"
          >
            <a
              target="_blank"
              href="https://router.heraldprotocol.xyz"
              class="group inline-flex items-center gap-[0.6rem] font-mono font-medium text-[0.85rem] text-heading no-underline tracking-[0.02em] transition-opacity duration-120 ease-out hover:opacity-70 active:opacity-50"
              >router.heraldprotocol.xyz</a
            >
          </dd>
        </div>
      </dl>
    </div>
  </div>
</section>

<footer
  data-screen-label="03 Start Building"
  class="bg-surface px-6 md:px-[clamp(1.5rem,8vw,8rem)] pt-[clamp(5rem,10vh,9rem)] mt-[clamp(6rem,10vh,10rem)]"
>
  <div
    class="grid grid-cols-1 gap-[clamp(2.5rem,6vw,6rem)] items-start max-w-350 pb-[clamp(4rem,8vh,7rem)]"
  >
    <div
      data-enter
      class="flex flex-col gap-5 opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
    >
      <span
        class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
        >Integration</span
      >
      <h2
        class="m-0 font-mono font-bold text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.05] tracking-[-0.01em] uppercase text-heading"
      >
        Start building
      </h2>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr_1px_1fr] gap-0 md:gap-[clamp(1.5rem,3vw,3rem)] items-stretch"
    >
      <article
        data-enter
        class="flex flex-col gap-4 min-h-full opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
      >
        <h3
          class="font-mono font-bold uppercase text-heading text-[clamp(1.4rem,2vw,1.75rem)] leading-[1.05] tracking-[-0.01em]"
        >
          x402
        </h3>
        <p
          class="font-sans text-[0.95rem] leading-[1.6] text-fg max-w-[38ch] flex-1"
        >
          Add the Herald facilitator to your server. Charge per request, per
          call, per artifact. Works with any x402 client. Settles on 0G in
          USDC.e.
        </p>
        <a
          href="https://docs.heraldprotocol.xyz/"
          target="_blank"
          rel="noopener"
          class="group mt-[0.4rem] font-mono font-medium text-[0.85rem] text-heading no-underline tracking-[0.02em] transition-opacity duration-120 ease-out inline-flex items-center gap-[0.6rem] self-start hover:opacity-70 active:opacity-50"
        >
          <span
            class="font-mono text-muted transition-[translate,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.75 group-hover:text-heading"
            >→</span
          >
          Quickstart for sellers
        </a>
      </article>

      <span
        aria-hidden="true"
        class="bg-line w-full h-px my-7 md:w-px md:h-auto md:my-0"
      ></span>

      <article
        data-enter
        class="flex flex-col gap-4 min-h-full opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-80 will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
      >
        <h3
          class="font-mono font-bold uppercase text-heading text-[clamp(1.4rem,2vw,1.75rem)] leading-[1.05] tracking-[-0.01em]"
        >
          Router
        </h3>
        <p
          class="font-sans text-[0.95rem] leading-[1.6] text-fg max-w-[38ch] flex-1"
        >
          Pay any protected service (HTTP 402) from anywhere without bridging.
          The router accepts payment on 0G and forwards on the destination
          server or chain.
        </p>
        <a
          href="https://docs.heraldprotocol.xyz/"
          target="_blank"
          rel="noopener"
          class="group mt-[0.4rem] font-mono font-medium text-[0.85rem] text-heading no-underline tracking-[0.02em] transition-opacity duration-120 ease-out inline-flex items-center gap-[0.6rem] self-start hover:opacity-70 active:opacity-50"
        >
          <span
            class="font-mono text-muted transition-[translate,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.75 group-hover:text-heading"
            >→</span
          >
          Quickstart for the router
        </a>
      </article>

      <span
        aria-hidden="true"
        class="bg-line w-full h-px my-7 md:w-px md:h-auto md:my-0"
      ></span>

      <article
        data-enter
        class="flex flex-col gap-4 min-h-full opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-160 will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
      >
        <h3
          class="font-mono font-bold uppercase text-heading text-[clamp(1.4rem,2vw,1.75rem)] leading-[1.05] tracking-[-0.01em]"
        >
          MPP
        </h3>
        <p
          class="font-sans text-[0.95rem] leading-[1.6] text-muted max-w-[38ch] flex-1"
        >
          Coming soon
        </p>
      </article>
    </div>
  </div>

  <div
    class="border-t border-line pt-[1.4rem] pb-[1.6rem] flex flex-col md:flex-row md:justify-between md:items-center items-start gap-2 md:gap-6 flex-wrap"
  >
    <span
      class="font-mono font-medium text-[0.7rem] tracking-[0.15em] uppercase text-muted leading-[1.4]"
      >© 2026 — Herald Protocol</span
    >
    <a
      href="https://docs.heraldprotocol.xyz/"
      target="_blank"
      rel="noopener"
      class="text-muted no-underline transition-[color,opacity] duration-120 ease-out font-sans font-medium text-[0.7rem] tracking-[0.15em] uppercase hover:text-heading active:opacity-50"
      >Docs ↗</a
    >
  </div>
</footer>
