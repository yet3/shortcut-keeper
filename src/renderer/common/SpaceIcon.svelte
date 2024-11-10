<script lang="ts">
  interface IProps {
    class?: string
  }

  const { ...props }: IProps = $props();
</script>

<div class="w-3 h-1.5 border-2 rounded-sm border-t-0 border-gray-300 {props.class}"></div>
