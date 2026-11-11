<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import Workplace from "./Workplace.svelte";
</script>

<Seo
  title="Minh Nguyen – Resume"
  description="Software engineer. TODO: one-sentence description of yourself."
/>

<section class="layout-md py-12">
  <h2 class="heading2">Professional Work</h2>

  <!-- TODO: one <Workplace> per role, newest first.
       hiddenMode="click" collapses bullets until clicked; "always" hides the role. -->
  <Workplace
    title="Software Engineer"
    company="Company"
    url="https://example.com/"
    dates="Month 20XX – Current"
    location="City, ST"
  >
    <li>What you built, and its measurable impact.</li>
    <li>Systems you owned and technologies used.</li>
  </Workplace>

  <Workplace
    title="Software Engineering Intern"
    company="Earlier Company"
    url="https://example.com/"
    dates="Month 20XX – Month 20XX"
    location="City, ST"
    hiddenMode="click"
  >
    <li>Older role, collapsed by default.</li>
  </Workplace>
</section>

<section class="layout-md py-12">
  <h2 class="heading2">Education</h2>

  <div class="mb-4">
    <div class="flex justify-between items-end">
      <h3 class="text-black text-lg">University</h3>
      <div class="text-neutral-500 mb-0.5">20XX — 20XX</div>
    </div>
    <p class="byline">Degree in Field</p>
  </div>

  <h4 class="font-medium mt-4 mb-1">Relevant coursework:</h4>
  <ul>
    <li>Course (Code)</li>
  </ul>
</section>

<section class="layout-md py-12">
  <h2 class="heading2">Awards and Honors</h2>

  <div class="mb-4">
    <h3 class="font-medium mb-1">Category:</h3>
    <ul>
      <li><b>Award name:</b> Detail (year)</li>
    </ul>
  </div>
</section>

<style lang="postcss">
  b {
    @apply font-medium;
  }

  ul {
    @apply list-disc pl-7 marker:text-neutral-400;
  }

  .byline {
    @apply font-serif italic;
  }
</style>
