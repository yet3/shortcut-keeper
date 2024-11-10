<script lang="ts">
  // TODO: clean up
  import { onDestroy } from "svelte";
  import type { ICombinationSegment } from "@typings/combination.type";
  import CombinationSegment from "@common/CombinationSegment.svelte";
  import { createField } from "felte";
  import { combinationSegmentsToString as _combinationSegmentsToString } from "@shared-lib/combinationSegmentsToString.lib";
  import { parseShortcutKeys as _parseShortcutKeys } from "@shared-lib/parseShortcutKeys.lib";
  import {
    SEPARATOR_CHORD_SYMBOL,
    SEPARATOR_SEQ_SYMBOL,
  } from "@shared-lib/consts";
  import type { IFieldErrors } from "./FieldErrors.svelte";
  import FieldErrors from "./FieldErrors.svelte";
  import Button, { BtnVariant } from "./Button.svelte";

  interface IProps {
    name?: string;
    value?: string;
    onSubmit?: (segments: ICombinationSegment[]) => void;
    onCancel?: () => void;
    errors?: IFieldErrors;
    disabled?: boolean;

    parserVersion: number;
  }

  const {
    parserVersion,
    value,
    name = "",
    onCancel,
    onSubmit,
    disabled,
    errors,
  }: IProps = $props();

  const parseShortcutKeys = (value?: string | null) => {
    if (!value) return [];
    return _parseShortcutKeys(value, parserVersion);
  };

  const combinationSegmentsToString = (segments: ICombinationSegment[]) => {
    return _combinationSegmentsToString(segments, parserVersion);
  };

  const { field, onInput, onBlur } = createField({
    name,
    onFormReset: () => {
      value;
    },
  });

  let isPicking = $state(false);

  let pickerEl: HTMLDivElement;
  let segments = $state<ICombinationSegment[]>(parseShortcutKeys(value));

  const heldKeys = new Set<string>();

  const handleMouseDown = (e: globalThis.MouseEvent) => {
    e.preventDefault();
    if (!pickerEl.contains(e.target as Node)) {
      handleSubmit();
    }
  };

  const recordKey = (key: string) => {
    const isChord = heldKeys.size > 0;
    if (segments.length > 0) {
      segments.push({
        id: Math.random().toString(),
        kind: isChord ? "separator-chord" : "separator-seq",
        displayValue: isChord ? SEPARATOR_CHORD_SYMBOL : SEPARATOR_SEQ_SYMBOL,
      });
    }

    segments.push({
      id: Math.random().toString(),
      kind: "key",
      displayValue: key.toLowerCase(),
    });
  };

  const handleKeyDown = (e: globalThis.KeyboardEvent) => {
    if (e.repeat) return;

    e.stopPropagation();
    e.preventDefault();

    recordKey(e.key);
    heldKeys.add(e.key.toLowerCase());
  };

  const handleKeyUp = (e: globalThis.KeyboardEvent) => {
    e.preventDefault();

    heldKeys.delete(e.key.toLowerCase());
  };

  const handleStartPicking = () => {
    if (isPicking) return;

    handleReset();
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    isPicking = true;
  };

  const handleReset = () => {
    segments = parseShortcutKeys(value);
  };

  const handleClear = () => {
    segments = [];
    onInput("");
  };

  const handleSubmit = () => {
    onInput(combinationSegmentsToString(segments));
    if (onSubmit) onSubmit(segments);
    handleStopPicking();
  };

  const handleStopPicking = () => {
    if (!isPicking) return;

    isPicking = false;
    cleanUp();
    onBlur();
    if (onCancel) onCancel();
  };

  const cleanUp = () => {
    handleReset();

    window.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };

  onDestroy(() => {
    cleanUp();
  });
</script>

<div class="flex flex-col" bind:this={pickerEl}>
  <span class="text-sm font-medium text-gray-500">Shortcut picker</span>
  <div class="relative w-full">
    <button
      use:field
      tabindex="0"
      type="button"
      class="w-full border border-gray-300 rounded p-2 text-gray-400 flex flex-wrap items-center justify-center gap-1 outline-none disabled:bg-gray-50"
      {disabled}
      onclick={handleStartPicking}
    >
      {#if segments.length === 0}
        Click to start recording
      {:else}
        {#each parseShortcutKeys(value) as segment}
          <CombinationSegment {segment} />
        {/each}
      {/if}
    </button>
    <FieldErrors {errors} />

    {#if isPicking}
      <div
        class="w-full absolute top-0 left-0 z-10 bg-white shadow-gray-300 shadow-md border border-gray-300 rounded p-2 text-gray-400"
      >
        <div class="text-sm font-medium text-gray-500 text-center">
          Press any key/combination of keys
        </div>
        <div
          class="min-h-12 flex flex-wrap gap-1 items-center justify-center p-1"
        >
          {#each segments as segment}
            <CombinationSegment
              {segment}
              onDelete={() => {
                const idx = segments.findIndex((seg) => seg.id === segment.id);
                if (idx >= 0) {
                  segments.splice(idx, 1);
                  if (idx > 0) {
                    segments.splice(idx - 1, 1);
                  } else segments.splice(idx, 1);
                }
              }}
            />
          {/each}
        </div>
        <div class="text-sm text-gray-800 flex justify-center gap-2 mt-2 mb-1">
          <Button variant={BtnVariant.OUTLINE} onclick={handleStopPicking}>
            Cancel
          </Button>
          <Button variant={BtnVariant.OUTLINE} onclick={handleClear}>
            Clear
          </Button>
          <Button variant={BtnVariant.OUTLINE} onclick={handleSubmit}>
            Save
          </Button>
        </div>
        <div
          class="text-xs text-gray-500 flex flex-col justify-center text-center"
        >
          <div>Click any mouse btn to save</div>
          <div>Click key to remove</div>
        </div>
      </div>
    {/if}
  </div>
</div>
