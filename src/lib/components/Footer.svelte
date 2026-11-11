<script lang="ts">
  // TODO: replace with your real handles.
  const contacts = [
    {
      label: "GitHub",
      text: "@YOUR_GITHUB",
      href: "https://github.com/YOUR_GITHUB",
    },
    {
      label: "LinkedIn",
      text: "in/YOUR_LINKEDIN",
      href: "https://www.linkedin.com/in/YOUR_LINKEDIN",
    },
    { label: "Email", text: "you@example.com", href: "mailto:you@example.com" },
  ];
</script>

<footer class="layout-md mt-20 text-lg flex flex-col">
  {#each contacts as c}
    <div class="row">
      <span>{c.label}</span>
      <hr />
      <a class="link" href={c.href}>{c.text}</a>
    </div>
  {/each}
</footer>

<style lang="postcss">
  .row {
    @apply flex items-center space-x-4;
  }

  .row span {
    @apply text-neutral-500;
  }

  .row hr {
    @apply w-full mt-0.5 border-neutral-300 border-dotted;
  }
</style>
