<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";
  import CloseBtn from "./CloseBtn.svelte";
  import type { ITag } from "@typings/tags.type";

  interface IProps {
    tag: ITag;
    class?: string;
    onDelete?: () => void;
    onClick?: () => void;
  }

  const { tag, onDelete, onClick, ...props }: IProps = $props();

  const bgColor = $derived(
    tag ? `var(--tag-bg-${tag.colorId}, var(--tag-bg-fallback))` : undefined,
  );
  const fgColor = $derived(
    tag ? `var(--tag-fg-${tag.colorId}, var(--tag-fg-fallback))` : undefined,
  );

  const handleAuxClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!onDelete) return;

    if (e.button === 1) {
      onDelete();
    }
  };
</script>

{#if tag}
  <button
    type="button"
    class="tag-base {props.class}"
    style:background={bgColor}
    style:color={fgColor}
    onauxclick={onDelete && handleAuxClick}
    onclick={onClick}
  >
    #{tag.name}

    {#if onDelete}
      <CloseBtn class="ml-1 size-3" color={fgColor} onClick={onDelete} />
    {/if}
  </button>
{/if}
