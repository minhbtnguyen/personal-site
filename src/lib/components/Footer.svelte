<script lang="ts">
  const contacts = [
    {
      label: "GitHub",
      text: "@minhbtnguyen",
      href: "https://github.com/minhbtnguyen",
    },
    {
      label: "Google Scholar",
      text: "@minhbtnguyen",
      href: "https://scholar.google.com/citations?user=9Pg_ZTgAAAAJ&hl=en",
    },
    {
      label: "LinkedIn",
      text: "in/minhbtnguyen",
      href: "https://www.linkedin.com/in/minhbtnguyen/",
    },
    { label: "X", text: "@minhbtnguyen", href: "https://x.com/minhbtnguyen" },
    {
      label: "Email",
      text: "minhbtnguyen.work@gmail.com",
      href: "mailto:minhbtnguyen.work@gmail.com",
    },
  ];
</script>

<footer class="layout-md mt-20 text-lg flex flex-col">
  {#each contacts as c}
    <div class="row">
      <span>{c.label}</span>
      <hr />
      <a class="link whitespace-nowrap" href={c.href}>{c.text}</a>
    </div>
  {/each}
</footer>

<style lang="postcss">
  .row {
    @apply flex items-center space-x-4;
  }

  .row span {
    @apply text-neutral-500 whitespace-nowrap;
  }

  .row hr {
    @apply w-full mt-0.5 border-neutral-300 border-dotted;
  }
</style>
