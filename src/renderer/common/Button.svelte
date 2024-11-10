<script module lang="ts">

  export enum BtnSize {
    "MD" = "MD",
    "SM" = "SM"
  }

  export enum BtnVariant {
    "PRIMARY" = "PRIMARY",
    "SUCCESS" = "SUCCESS",
    "DANGER" = "DANGER",
    "OUTLINE" = "OUTLINE",
  }
</script>

<script lang="ts">
  import clsx from "clsx";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface IProps extends HTMLButtonAttributes {
    size?: BtnSize
    variant: BtnVariant
    children: Snippet;
  }

  const {children, size=BtnSize.MD, variant = BtnVariant.PRIMARY, ...props }: IProps = $props();

  const isVariant = (_variant: BtnVariant): boolean => {
    return _variant === variant
  }

  const isSize = (_size: BtnSize): boolean => {
    return _size === size
  }
</script>

<button 
  type="button"
  {...props} 
  class={clsx(props.class, {
    "btn-base": true,
    "btn-size-md": isSize(BtnSize.MD),
    "btn-size-sm": isSize(BtnSize.SM),
    "btn-primary": isVariant(BtnVariant.PRIMARY),
    "btn-success": isVariant(BtnVariant.SUCCESS),
    "btn-danger": isVariant(BtnVariant.DANGER),
    "btn-outline": isVariant(BtnVariant.OUTLINE)
  })}
>
  {@render children()}
</button>
