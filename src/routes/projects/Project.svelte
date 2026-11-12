<script lang="ts">
  import { Award, Star } from "lucide-svelte";

  import Markdown from "$lib/components/Markdown.svelte";
  import { formatTime } from "$lib/utils";

  type Project = {
    title: string;
    date?: string;
    year?: number;
    content: string;
    repo: string;
    /** Live demo URL; the title and image link here when set, else to the repo. */
    url?: string;
    topics: string[];
    lead: string;
    image: string;
    /** Optional recognition, shown in serif italics with an award icon. */
    award?: string;
    award_url?: string;
  };

  export let data: Project;
  export let images: Record<string, { default: string }>;
  export let stars: Record<string, number> | null = null;

  $: repoUrl = `https://github.com/${data.repo}`;
  $: href = data.url ?? repoUrl;
  $: imageSrc = images[`../../projects/${data.image}`]?.default;
  $: starCount = stars?.[data.repo] ?? 0;
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
  <div class="md:col-span-2">
    <!-- Title and date -->
    <h3 class="text-black text-xl font-semibold mb-1">
      <a {href} class="hover:underline underline-offset-4 decoration-1"
        >{data.title}</a
      >
      <small
        class="ml-1 whitespace-nowrap text-neutral-500 text-base font-normal"
      >
        {data.date ? formatTime("%B %Y", data.date) : data.year}
      </small>
    </h3>

    <!-- Stars and stack -->
    <p
      class="flex flex-wrap items-center gap-x-2 text-sm text-neutral-500 mb-3"
    >
      {#if starCount > 0}
        <a
          class="flex items-center gap-1 hover:text-black transition-colors"
          href="{repoUrl}/stargazers"
        >
          <Star size={13} class="fill-current" />
          {starCount.toLocaleString()}
        </a>
        <span class="text-neutral-300">·</span>
      {/if}
      <span>{data.topics.join(" · ")}</span>
    </p>

    <p class="text-lg font-light mb-3">{data.lead}</p>

    <div class="body">
      <Markdown source={data.content} />
    </div>

    {#if data.award}
      <a
        class="award group"
        href={data.award_url ?? href}
        target="_blank"
        rel="noreferrer"
      >
        <Award size={18} strokeWidth={1.8} class="shrink-0 text-amber-600" />
        <span class="group-hover:text-black transition-colors"
          >{data.award}</span
        >
      </a>
    {/if}

    <p class="flex gap-5">
      {#if data.url}
        <a class="link" href={data.url}>Live demo</a>
      {/if}
      <a class="link" href={repoUrl}>GitHub</a>
    </p>
  </div>

  <a {href} class="md:col-span-1">
    <img
      src={imageSrc}
      alt="{data.title} screenshot"
      class="w-full rounded-lg border border-neutral-200"
      loading="lazy"
    />
  </a>
</div>

<style lang="postcss">
  .body :global(p) {
    @apply mb-4;
  }

  .award {
    @apply flex items-center gap-2 mb-4 font-serif italic text-[1.1rem] text-neutral-800;
  }
</style>
