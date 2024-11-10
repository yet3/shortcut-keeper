<script lang="ts">
  import CloseBtn from "@common/CloseBtn.svelte";
  import Key from "@common/Key.svelte";
  import type { ICombinationSegment } from "@typings/combination.type";

  interface IProps {
    segment: ICombinationSegment;
    onDelete?: (segment: ICombinationSegment) => void;
  }

  const { segment, onDelete }: IProps = $props();
</script>

{#if segment.kind === "key"}
  {#if onDelete}
    <button
      type="button"
      onclick={() => onDelete(segment)}
      class="group rounded relative"
    >
      <div
        class="hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-red-400 rounded items-center justify-center"
      >
        <CloseBtn class="size-3" color="black" />
      </div>
      <Key key={segment.displayValue} />
    </button>
  {:else}
    <Key key={segment.displayValue} />
  {/if}
{:else if segment.kind.startsWith("separator")}
  <div class="text-gray-500 text-xs whitespace-pre min-w-2">
    {segment.displayValue}
  </div>
{/if}
