<script lang="ts">
  import clsx from "clsx";

  interface IProps {
    onClick?: () => void;
    class?: string;
    color?: string;
  }

  const { onClick, color = "#9ca3af", ...props }: IProps = $props();
</script>

<button
  aria-label="Close button"
  type="button"
  class="relative aspect-square grid place-items-center size-4 {props.class}"
  onclick={onClick}
>
  <div
    style="--color: {color};"
    class={clsx({
      "w-full h-full": true,
      "before:bg-[var(--color)] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-[1px] before:rotate-45 before:rounded": true,
      "after:bg-[var(--color)] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-full after:h-[1px] after:-rotate-45 after:rounded": true,
    })}
  ></div>
</button>
