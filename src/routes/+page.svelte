<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
</script>

<Seo
  title="Minh Nguyen"
  description="Software engineer, researcher, and builder. Platform Engineering at BlackRock."
/>

<p
  class="layout-md text-black text-xl leading-tight font-light mb-16"
  id="tagline"
>
  <span class="g">is a</span> software engineer<span class="g">,</span><br />
  researcher<span class="g">, and</span><br />
  builder<span class="g">.</span>
</p>

<div class="layout-md text-lg space-y-14">
  <div class="space-y-5">
    <p>
      I work on the Platform Engineering team at
      <a class="link" href="https://www.blackrock.com">BlackRock</a>, where I
      build production LLM and agentic systems for financial workflows.
    </p>

    <p>
      Previously, I built a real-time predictive maintenance system for factory
      robots at <a class="link" href="https://www.tesla.com">Tesla</a> and a
      hybrid recommendation system at
      <a class="link" href="https://homebase.com.vn/homepage/">Homebase</a> (<a
        class="link"
        href="https://www.ycombinator.com/companies/homebase">YC W21</a
      >). At
      <a class="link" href="https://shield.ai">Heron Systems</a> (now Shield AI),
      I worked on NLP research for defense.
    </p>

    <p>
      I also did
      <a
        class="link"
        href="https://scholar.google.com/citations?user=9Pg_ZTgAAAAJ&hl=en"
        >ML research</a
      >
      across cybersecurity, computer vision, and robotics, including deep learning
      cyberattack detection for water distribution systems. I hold a B.S. and M.S.
      in Computer Engineering, focused on machine learning, from
      <a class="link" href="https://www.vt.edu">Virginia Tech</a>.
    </p>

    <p>Other interests: running, pickleball, meditation, and reading.</p>
  </div>

  <div class="space-y-5">
    <img
      class="w-full aspect-[4/3] object-cover object-[50%_75%]"
      alt="Photograph of Minh Nguyen"
      src="/assets/images/profile.jpg"
    />
  </div>
</div>

<style lang="postcss">
  .g {
    @apply text-neutral-400;
  }

  /* Correction for vertical navigation links on mobile. */
  @media (max-width: 420px) {
    #tagline {
      @apply -mt-10;
    }
  }
</style>
