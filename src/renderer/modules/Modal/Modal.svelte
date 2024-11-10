<script lang="ts">
  import type { Snippet } from "svelte";

  interface IProps  {
    children: Snippet;
    width?: string

    onClose?: () => void
  }

  const { children, width, onClose }: IProps = $props();
</script>

<div class="fixed inset-0 w-screen h-screen">
  <button aria-label="Modal's backdrop" onclick={onClose} class="absolute inset-0 w-full h-full bg-black/70 cursor-default"></button>
  <aside
    style:width={width}
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded border border-gray-300 bg-white"
  >
    {@render children()}
  </aside>
</div>
