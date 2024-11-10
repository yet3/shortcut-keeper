<script lang="ts">
  import { shortcutsStore } from "@stores/shortcutsStore.svelte";
  import Search from "./Search.svelte";
  import { searchStore } from "@stores/searchStore.svelte";
  import fuzzysort from "fuzzysort";
  import ShortcutItem from "./ShortcutItem.svelte";
  import ShortcutEditorModal from "./ShortcutEditor/ShortcutEditorModal.svelte";
  import Button, { BtnVariant } from "@common/Button.svelte";
  import { KEY_END_SYMBOL, KEY_START_SYMBOL } from "@shared-lib/consts";

  let shortcutEditorData = $state<null | string>(null);

  const filteredShortcuts = $derived.by(() => {
    let shortcuts = $shortcutsStore.shortcuts.filter((shortcut) => {
      for (const tag of $searchStore.tags) {
        if (!shortcut.tagsIds.has(tag.id)) {
          return false;
        }
      }
      return true;
    });

    shortcuts = shortcuts.filter((shortcut) => {
      for (const key of $searchStore.keys) {
        if (
          !shortcut.combination.includes(
            `${KEY_START_SYMBOL}${key}${KEY_END_SYMBOL}`,
          )
        ) {
          return false;
        }
      }
      return true;
    });

    shortcuts = shortcuts.sort((a, b) => a.name.localeCompare(b.name));

    return fuzzysort.go($searchStore.query, shortcuts, {
      keys: [(shortcut) => shortcut.name, (shortcut) => shortcut.description],
      all: true,
    });
  });
</script>

{#if shortcutEditorData != null}
  <ShortcutEditorModal
    onClose={() => (shortcutEditorData = null)}
    editedShortcutId={shortcutEditorData}
  />
{/if}

<main class="grid grid-rows-[auto_1fr] h-screen overflow-hidden">
  <header class="p-3 grid grid-cols-[1fr_auto] items-start gap-2 w-full">
    <Search />
    <Button
      variant={BtnVariant.SUCCESS}
      class="mt-5"
      onclick={() => (shortcutEditorData = "")}>Add shortcut</Button
    >
  </header>

  <div
    style:--cols="225px 275px 1fr 1fr 125px"
    style:--gap="0.5rem"
    class="overflow-hidden"
  >
    <div
      class="grid font-semibold text-base px-3 text-gray-300 border-b border-gray-100 pb-1"
      style:grid-template-columns="var(--cols)"
      style:gap="var(--gap)"
    >
      <div>Name</div>
      <div>Shortcut</div>
      <div>Description</div>
      <div>Tags</div>
      <div>Action</div>
    </div>

    <ul class="grid content-start gap-4 h-full pb-48 overflow-y-auto px-3">
      {#each filteredShortcuts as shortcut (shortcut.obj.id)}
        <ShortcutItem
          shortcut={shortcut.obj}
          onEdit={() => (shortcutEditorData = shortcut.obj.id)}
        />
      {/each}
    </ul>
  </div>
</main>
