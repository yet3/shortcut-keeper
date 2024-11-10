<script lang="ts">
    import SpaceIcon from "./SpaceIcon.svelte";

  interface IProps {
    key: string;
  }

  const { key }: IProps = $props();

  const shadows =
    "0px 2px 0px 1px rgba(0,0,0,0.14), inset 0px 0px 0px 2px rgba(50,50,100,0.05)";
</script>

<kbd
  class="text-xs grid place-items-center px-1 min-w-5 h-5 leading-none rounded border border-gray-300 text-gray-500"
  style:box-shadow={shadows}
>
  {#if key === " "}
    <!-- TODO: don't use important -->
    <SpaceIcon class="border-gray-400" /> 
  {:else}
    {key}
  {/if}
</kbd>
