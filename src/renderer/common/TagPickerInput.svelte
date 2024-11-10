<script lang="ts">
  import Tag from "@common/Tag.svelte";
  import clsx from "clsx";
  import { tagsStore } from "@stores/tagsStore.svelte";
  import type { ITag } from "@typings/tags.type";
  import type { KeyboardEventHandler, MouseEventHandler } from "svelte/elements";
  import fuzzysort from "fuzzysort";
  import Input from "@common/Input.svelte";
  import { v4 as uuidv4 } from 'uuid';
  import { onDestroy, onMount } from "svelte";

  interface IProps {
    inputLabel?: string;
    onCancel?: () => void;
    onSubmit: (tag: ITag) => void;

    excludeTagsByIds?: string[];
    creatableTag?: boolean

    noFloatList?: boolean
    focusOnMount?: boolean
    showListWhenInputEmpty?: boolean
    class?: string;
    disabled?: boolean
  }

  const {
    excludeTagsByIds = [],
    onCancel,
    onSubmit,
    inputLabel,
    creatableTag = false,
    noFloatList,
    focusOnMount,
    showListWhenInputEmpty,
    disabled,
    ...props
  }: IProps = $props();

  let searchQuery = $state("");
  let selectedIdx = $state(0);
  let isFocused = $state(false)
  const isOpen = $derived(isFocused && (showListWhenInputEmpty || searchQuery.length > 0))
  let containerEl: HTMLDivElement;

  const canCreateTag = $derived.by(() => {
    if (!creatableTag || searchQuery.length === 0) {
      return false;
    }

    const exists = filteredTags.find(t => t.obj.name === searchQuery.trim())
    if (exists) return false;

    return true;
  })

  const filteredTags = $derived.by(() => {
    const tags = $tagsStore.tags.filter((tag) => !excludeTagsByIds.includes(tag.id)).sort((a,b) => a.name.localeCompare(b.name));

    return fuzzysort.go(searchQuery, tags, {
      keys: [(tag) => tag.name],
      limit: 4,
      all: true,
    });
  });

  const maxSelectedIdx = $derived(filteredTags.length - 1 + (canCreateTag ? 1 : 0))

  let inputEl = $state<HTMLInputElement>();

  const handleMouseDown = (e: globalThis.MouseEvent) => {
    if (!(e.target instanceof Node)) return;
    if (!containerEl.contains(e.target)) {
      handleCancel();
    }
  }

  onMount(() => {
    if (focusOnMount && inputEl) {
      inputEl.focus()
      isFocused = true
    }

    window.addEventListener('mousedown', handleMouseDown)
  })

  onDestroy(() => {
    window.removeEventListener('mousedown', handleMouseDown)
  })

  const handleNextItem = () => {
    let idx = selectedIdx + 1;
    if (idx > maxSelectedIdx) {
      idx = 0;
    }
    selectedIdx = idx;
  };

  const handlePrevItem = () => {
    let idx = selectedIdx - 1;
    if (idx < 0) {
      idx = maxSelectedIdx;
    }
    selectedIdx = idx;
  };

  const clear = () => {
    selectedIdx = 0
    searchQuery = ""
  }

  const handleOnFocus = () => {
    clear();
    isFocused = true;
  }

  const handleCancel = () => {
    clear();
    isFocused = false;
    if (onCancel) onCancel();
  };

  const handleSubmit = (idx: number) => {
    if (filteredTags[idx]) {
      onSubmit(filteredTags[idx].obj);
      clear();
    } else if (canCreateTag) {
      // TODO: handle tag color
      onSubmit({
        id: uuidv4(),
        name: searchQuery.trim(),
        colorId: "kl8nls2v1"
      });
    } else handleCancel()
    clear();
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!isFocused) isFocused = true;

    if (!isOpen) return;

    switch (e.key) {
      case "Tab":
        e.preventDefault();
        if (e.shiftKey) handlePrevItem();
        else handleNextItem();
        return;
      case "ArrowUp":
        e.preventDefault();
        handlePrevItem();
        return;
      case "ArrowDown":
        e.preventDefault();
        handleNextItem();
        return;
      case "Escape":
        e.preventDefault();
        handleCancel();
        return;
      case "Enter":
        e.preventDefault();
        handleSubmit(selectedIdx)
        return;
    }
  };

  const handleClickOnList: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (!e.currentTarget.contains(target)) return;

    const idx = target.getAttribute('data-item-idx');
    if (idx == null) return;
    handleSubmit(Number(idx))

  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events,a11y_no_static_element_interactions -->
<div class="flex flex-col relative {props.class}" bind:this={containerEl}>
  <Input
    bind:inputRef={inputEl}
    bind:value={searchQuery}
    label={inputLabel}
    class="border-l-0 rounded-r pl-0"
    placeholder="Tag name"
    onkeydown={handleKeyDown}
    onfocus={handleOnFocus}
    disabled={disabled}
  >
    {#snippet prefix()}
      <span class="px-1 text-gray-400">
        #
      </span>
    {/snippet}
  </Input>

  {#if isOpen && !disabled}
    <div 
      onmousedown={handleClickOnList}
      class={clsx({
        "mt-1": true,
        "absolute top-full w-full left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded z-10": !noFloatList
      })}
    >
      {#if filteredTags.length === 0}
        {#if !canCreateTag}
          <div class="my-2 text-center text-gray-400">No tags</div>
        {/if}
      {:else}
        <ul class="grid content-start">
          {#each filteredTags as tag, idx (tag.obj.id)}
            <li data-item-idx={idx} class="p-2 rounded" class:bg-green-100={idx === selectedIdx}>
              <Tag tag={tag.obj} />
            </li>
          {/each}
        </ul>
      {/if}
      {#if canCreateTag}
        <div data-item-idx={maxSelectedIdx} class="py-2 text-center text-green-600 rounded" class:bg-green-100={maxSelectedIdx === selectedIdx}>Create tag</div>
      {/if}
    </div>
  {/if}
</div>
