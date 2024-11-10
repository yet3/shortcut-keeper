<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import type { IFieldErrors } from "./FieldErrors.svelte";
  import FieldErrors from "./FieldErrors.svelte";

  interface IProps extends HTMLTextareaAttributes {
    label?: string;
    errors?: IFieldErrors;

    name?: HTMLTextareaAttributes["name"];
    class?: string;
  }

  const { label, name, errors, ...props }: IProps = $props();
  const inputId = `input-${Math.random()}`;
</script>

<div class="flex flex-col w-full {props.class}">
  {#if label}
    <label for={inputId} class="text-sm font-medium text-gray-500"
      >{label}</label
    >
  {/if}
  <textarea
    {...props}
    id={inputId}
    class="text-gray-800 border border-gray-300 rounded p-1 outline-none w-full resize-none"
    {name}
  ></textarea>
  <FieldErrors {errors} />
</div>
