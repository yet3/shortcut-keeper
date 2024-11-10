<script lang="ts">
  import { parseShortcutKeys } from "@shared-lib/parseShortcutKeys.lib";
  import type { IShortcut } from "@typings/shortcuts.type";
  import CombinationSegment from "@common/CombinationSegment.svelte";
  import Tag from "@common/Tag.svelte";
  import { tagsStore } from "@stores/tagsStore.svelte";
  import { removeShortcut } from "@stores/shortcutsStore.svelte";
  import Button, { BtnSize, BtnVariant } from "@common/Button.svelte";

  interface IProps {
    shortcut: IShortcut;
    onEdit: () => void;
  }

  const { shortcut, onEdit }: IProps = $props();

  const segments = $derived(parseShortcutKeys(shortcut.combination));
  const tags = $derived(
    $tagsStore.tags.filter((tag) => shortcut.tagsIds.has(tag.id)),
  );

  const handleDelete = async () => {
    const canDelete = window.confirm("Are you sure?")
    if (!canDelete) return;

    const resp = await window.api("shortcuts.deleteOne", {
      shortcutId: shortcut.id,
    });

    if ("data" in resp) {
      removeShortcut(resp.data.shortcutId);
    } else {
      console.error(resp);
      window.alert(resp.error.message);
    }
  };
</script>

<li
  class="grid items-start border-b border-gray-100 py-1 first-of-type:pt-4"
  style:grid-template-columns="var(--cols)"
  style:gap="var(--gap)"
>
  <div>
    {shortcut.name}
  </div>
  <ul class="flex gap-1">
    {#each segments as segment}
      <li class="flex items-center">
        <CombinationSegment {segment} />
      </li>
    {/each}
  </ul>
  <p class="text-sm">
    {shortcut.description}
  </p>
  <ul class="flex flex-wrap gap-1">
    {#each tags as tag (tag.id)}
      <li class="w-fit">
        <Tag {tag} />
      </li>
    {/each}
  </ul>

  <div class="flex items-center gap-2">
    <Button variant={BtnVariant.PRIMARY} size={BtnSize.SM} onclick={onEdit}>
      Edit</Button
    >
    <Button
      variant={BtnVariant.DANGER}
      size={BtnSize.SM}
      onclick={handleDelete}>Delete</Button
    >
  </div>
</li>
