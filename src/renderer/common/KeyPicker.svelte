<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  const DIALOG_WIDTH = 200;

  interface IProps {
    x: number;
    y: number;
    onCancel: () => void;
    onSubmit: (key: string) => void;

    excludeKeys?: string[];
  }

  const { x, y, excludeKeys = [], onCancel, onSubmit }: IProps = $props();

  let popupEl: HTMLElement;

  const handleMouseDown = (e: globalThis.MouseEvent) => {
    if (!(e.target instanceof Node)) return;
    if (!popupEl.contains(e.target)) {
      onCancel();
    }
  };

  let pressedKey = "" 

  const handleKeyDown = (e: globalThis.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    pressedKey = e.key;
  };

  const handleKeyUp = (e: globalThis.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (pressedKey !== e.key) {
      return;
    }

    if (excludeKeys.includes(e.key)) {
      onCancel();
      return;
    }

    onSubmit(e.key.toLowerCase());
  }

  onMount(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("mousedown", handleMouseDown);
  });

  const left = $derived.by(() => {
    if (x + DIALOG_WIDTH + 12 >= window.innerWidth) {
      return window.innerWidth - DIALOG_WIDTH - 12;
    }
    return x;
  });
</script>

<aside
  bind:this={popupEl}
  class="flex flex-col absolute rounded border border-gray-300 bg-white shadow-gray-300 shadow-lg p-2 text-center font-semibold text-gray-400 z-10"
  style:top={y + "px"}
  style:left={left + "px"}
  style:width={DIALOG_WIDTH + "px"}
>
  Press the key
</aside>
