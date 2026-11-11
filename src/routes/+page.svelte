<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";

  import Seo from "$lib/components/Seo.svelte";

  // TODO: list your highlighted projects. `href` anchors match file names in src/projects/.
  const featuredProjects = [
    {
      name: "Example Project",
      href: "/projects#example-project",
      desc: "one-line description of what it does",
      aside: "optional metric, e.g. 1K+ stars on GitHub",
    },
  ];
</script>

<Seo
  title="Minh Nguyen"
  description="Software engineer. TODO: one-sentence description of yourself."
/>

<p
  class="layout-md text-black text-xl leading-tight font-light mb-16"
  id="tagline"
>
  <span class="g">is a</span> software engineer<span class="g">,</span><br />
  builder<span class="g">, and</span><br />
  learner<span class="g">.</span>
</p>

<div class="layout-md text-lg space-y-14">
  <div class="space-y-5">
    <p>
      I work at <a class="link" href="https://example.com">Company</a>.
      <!-- TODO: current role -->
    </p>

    <p>
      I care about <em>reliable systems</em> and
      <em>thoughtful interfaces</em>. TODO: a short paragraph on what drives
      your work.
    </p>
  </div>

  <div class="leading-snug space-y-4">
    <p class="pb-2">Notable work:</p>

    {#each featuredProjects as project}
      <a class="project-pair" href={project.href}>
        <div class="text-black font-medium">
          {project.name}
          <ArrowUpRight size={18} class="inline text-neutral-400" />
        </div>
        <div>
          <p>{project.desc}</p>
          {#if project.aside}
            <aside>{project.aside}</aside>
          {/if}
        </div>
      </a>
    {/each}
  </div>

  <div class="space-y-5">
    <p>
      Previously, I worked at <a class="link" href="https://example.com"
        >Company A</a
      >
      and <a class="link" href="https://example.com">Company B</a>.
      <!-- TODO: background, education, notable achievements -->
    </p>

    <p>Other interests: TODO.</p>
  </div>

  <!-- TODO: add a photo at static/assets/images/profile.jpg, then uncomment.
  <div class="space-y-5">
    <img alt="Photograph of Minh Nguyen" src="/assets/images/profile.jpg" />
  </div>
  -->
</div>

<style lang="postcss">
  .g {
    @apply text-neutral-400;
  }

  em {
    @apply font-serif text-[110%] leading-[100%];
  }

  .project-pair {
    @apply grid sm:grid-cols-[1fr,2fr] gap-y-1 -mx-3 px-3 py-2 hover:bg-neutral-100 transition-colors;
  }

  aside {
    @apply mt-0.5 text-base text-neutral-500;
  }

  /* Correction for vertical navigation links on mobile. */
  @media (max-width: 420px) {
    #tagline {
      @apply -mt-10;
    }
  }
</style>
