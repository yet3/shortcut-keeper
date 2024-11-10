<script lang="ts">
  import {
    addSearchKey,
    addSearchTag,
    removeSearchKey,
    removeSearchTag,
    searchStore,
  } from "@stores/searchStore.svelte.ts";
  import Tag from "@common/Tag.svelte";
  import type { KeyboardEventHandler } from "svelte/elements";
  import TagPicker from "@common/TagPicker.svelte";
  import KeyPicker from "@common/KeyPicker.svelte";
  import CombinationSegment from "@common/CombinationSegment.svelte";

  let pickerPos = $state<{
    which: "keys" | "tags";
    x: number;
    y: number;
  } | null>(null);
  const tagsIds = $derived($searchStore.tags.map((tag) => tag.id));

  let rulerEl: HTMLDivElement;
  let inputEl: HTMLInputElement;

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (["#", ":"].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();

      rulerEl.innerHTML = e.currentTarget.value.substring(
        0,
        e.currentTarget.selectionEnd ?? 0,
      );

      const inpuRect = e.currentTarget.getBoundingClientRect();
      const caretRect = rulerEl.getBoundingClientRect();

      pickerPos = {
        which: e.key === "#" ? "tags" : "keys",
        x: inpuRect.x + 4 + caretRect.width,
        y: inpuRect.y + 4,
      };
    } else pickerPos = null;
  };
</script>

<div class="flex flex-col w-full">
  <div bind:this={rulerEl} class="fixed invisible pointer-events-none"></div>
  {#if pickerPos?.which === "tags"}
    <TagPicker
      x={pickerPos?.x}
      y={pickerPos?.y}
      excludeTagsByIds={tagsIds}
      onCancel={() => {
        inputEl.focus();
        $searchStore.query += "#";
        pickerPos = null;
      }}
      onSubmit={(tag) => {
        addSearchTag(tag);
        inputEl.focus();
        pickerPos = null;
      }}
    />
  {:else if pickerPos?.which === "keys"}
    <KeyPicker
      x={pickerPos?.x}
      y={pickerPos?.y}
      excludeKeys={$searchStore.keys}
      onCancel={() => {
        inputEl.focus();
        $searchStore.query += ":";
        pickerPos = null;
      }}
      onSubmit={(key) => {
        addSearchKey(key);
        inputEl.focus();
        pickerPos = null;
      }}
    />
  {/if}

  <div class="flex items-end">
    <div class="ml-auto mr-1 text-sm text-gray-300 flex gap-2 h-5">
      <p>type # to start searching for a tag</p>
      <span>|</span>
      <p>type : to start searching for a key</p>
    </div>
  </div>
  <div class="w-full flex">
    <input
      bind:this={inputEl}
      bind:value={$searchStore.query}
      id="search-input"
      onkeydown={handleKeyDown}
      placeholder="Shortcut name, #tags, :keys"
      class="px-1 h-10 border border-gray-300 rounded w-full outline-none"
    />
  </div>

  {#if $searchStore.keys.length > 0}
    <ul class="flex flex-wrap gap-2 mt-2 min-h-5">
      {#each $searchStore.keys as key}
        <li class="w-fit">
          <CombinationSegment
            onDelete={() => removeSearchKey(key)}
            segment={{ id: "fake", kind: "key", displayValue: key }}
          />
        </li>
      {/each}
    </ul>
  {/if}
  {#if $searchStore.tags.length > 0}
    <ul class="flex flex-wrap gap-2 mt-2 min-h-8">
      {#each $searchStore.tags as tag (tag.id)}
        <li class="w-fit">
          <Tag {tag} onDelete={() => removeSearchTag(tag.id)} />
        </li>
      {/each}
    </ul>
  {/if}
</div>
