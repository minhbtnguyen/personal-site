<!--
  One resume row, matching the Writing page: title and right-aligned meta on
  the first line, a serif-italic subtitle (and optional aside) on the second.
-->
<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";

  export let title: string;
  export let subtitle: string;
  export let meta = "";
  export let aside = "";
  export let href: string | undefined = undefined;
</script>

<svelte:element
  this={href ? "a" : "div"}
  {href}
  class="block -mx-3 px-3 py-2"
  class:row-link={href}
  target={href ? "_blank" : undefined}
  rel={href ? "noreferrer" : undefined}
>
  <div class="flex flex-col sm:flex-row sm:items-end sm:gap-6 mb-1">
    <div class="text-lg text-black">
      {title}
      {#if href}
        <ArrowUpRight size={18} class="inline text-neutral-400" />
      {/if}
    </div>
    {#if meta}
      <div class="sm:ml-auto mb-0.5 shrink-0 text-neutral-500">{meta}</div>
    {/if}
  </div>
  <div class="flex flex-col sm:flex-row sm:items-baseline sm:gap-6">
    <div class="text-lg leading-snug font-serif italic">{subtitle}</div>
    {#if aside}
      <div class="sm:ml-auto shrink-0 text-neutral-400">{aside}</div>
    {/if}
  </div>
</svelte:element>

<style lang="postcss">
  .row-link {
    @apply hover:bg-neutral-100 transition-colors;
  }
</style>
