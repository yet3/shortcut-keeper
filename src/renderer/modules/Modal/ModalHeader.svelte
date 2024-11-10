<script lang="ts">
  import CloseBtn from "@common/CloseBtn.svelte";
import type { Snippet } from "svelte";

  interface IProps {
    children: Snippet;
    onClose?: () => void
  }

  const { children, onClose }: IProps = $props();
</script>

<header class="p-2 flex w-full gap-2">
  <h2 class="font-medium">
    {@render children()}
  </h2>
  {#if onClose}
    <CloseBtn class="ml-auto" onClick={onClose} />
  {/if}
</header>
