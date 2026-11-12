<!--
  Section title with an optional total inline, the same way Projects shows
  "Title  2026": e.g. "Professional Work  3 yrs 7 mos".
-->
<script lang="ts">
  export let title: string;
  export let total = "";
</script>

<h2 class="text-black text-xl font-semibold mb-6">
  <span class="mr-1">{title}</span>
  {#if total}
    <small class="whitespace-nowrap text-neutral-500 text-base font-normal">
      {total}
    </small>
  {/if}
</h2>
