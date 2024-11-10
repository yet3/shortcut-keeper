<script module lang="ts">

  export type IFieldErrors = string[] | string | undefined| null
  
</script>

<script lang="ts">
  interface IProps {
    class?: string
    errors: IFieldErrors
  }

  const { errors: ogErrors, ...props }: IProps = $props();
  
  const errors = $derived.by(() => {
    if (!ogErrors) return null;
    if (Array.isArray(ogErrors)) return ogErrors;
    return [ogErrors];
  });
</script>


{#if errors}
  <ul class="text-sm {props.class}">
    {#each errors as error}
      <li class="text-red-500">{error}</li>
    {/each}
  </ul>
{/if}
