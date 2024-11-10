<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import clsx from "clsx";
  import type { Snippet } from "svelte";
  import type { IFieldErrors } from "./FieldErrors.svelte";
  import FieldErrors from "./FieldErrors.svelte";

  interface IProps extends Omit<HTMLInputAttributes, 'prefix'> {
    label?: string;
    errors?: IFieldErrors

    prefix?: Snippet;
    suffix?: Snippet;
    inputRef?: HTMLInputElement;
  }

  let {
    prefix,
    suffix,
    label,
    type = "text",
    errors: ogErrors,
    value = $bindable(),
    inputRef = $bindable(),
    ...props
  }: IProps = $props();
  const inputId = `input-${Math.random()}`;

  const errors = $derived.by(() => {
    if (!ogErrors) return null;
    if (Array.isArray(ogErrors)) return ogErrors;
    return [ogErrors];
  });
</script>

<div class="flex flex-col w-full">
  {#if label}
    <label for={inputId} class="text-sm font-medium text-gray-500"
      >{label}</label
    >
  {/if}
  <div class="border border-gray-300 rounded flex items-center">
    {#if prefix}
      {@render prefix()}
    {/if}
    <input
      {...props}
      id={inputId}
      bind:this={inputRef}
      bind:value={value}
      class={clsx(
        "text-gray-800 rounded p-1 outline-none w-full placeholder:text-gray-400",
        props.class,
      )}
      {type}
    />
    {#if suffix}
      {@render suffix()}
    {/if}
  </div>
  <FieldErrors {errors} />
</div>
