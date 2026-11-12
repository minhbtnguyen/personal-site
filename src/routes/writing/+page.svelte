<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import WritingList from "./WritingList.svelte";
  import writing from "./writing.yaml";
</script>

<Seo
  title="Minh Nguyen – Writing"
  description="Academic papers on machine learning for cyber-physical systems and critical infrastructure security."
/>

<section class="layout-md py-12">
  <h2 class="heading2">Academic Writing</h2>
  <WritingList data={writing.papers} />
</section>
