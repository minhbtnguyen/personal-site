<script lang="ts">
  import { page } from "$app/stores";

  export let title: string;
  export let ogTitle: string | null = null;
  export let description: string;

  const SITE = "https://minhbtnguyen.com";
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{SITE}{$page.url.pathname}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{SITE}{$page.url.pathname}" />
  <meta property="og:title" content={ogTitle ?? title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="{SITE}/assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>
