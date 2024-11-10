<script lang="ts">
  import type { ITag } from "@typings/tags.type";
  import TagPickerInput from "./TagPickerInput.svelte";

  const DIALOG_WIDTH = 200;

  interface IProps {
    x: number;
    y: number;
    onCancel: () => void;
    onSubmit: (tag: ITag) => void;

    excludeTagsByIds?: string[];
  }

  const { x, y, excludeTagsByIds = [], onCancel, onSubmit }: IProps = $props();

  const left = $derived.by(() => {
    if (x + DIALOG_WIDTH + 12 >= window.innerWidth) {
      return window.innerWidth - DIALOG_WIDTH - 12;
    }
    return x;
  });
</script>

<aside
  class="flex flex-col absolute rounded border border-gray-300 bg-white shadow-gray-300 shadow-lg p-2 z-10"
  style:top={y + "px"}
  style:left={left + "px"}
  style:width={DIALOG_WIDTH + "px"}
>
  <TagPickerInput
    noFloatList
    focusOnMount
    showListWhenInputEmpty
    {excludeTagsByIds}
    {onCancel}
    {onSubmit}
  />
</aside>
