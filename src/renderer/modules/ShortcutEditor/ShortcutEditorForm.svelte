<script module lang="ts">
  const schema = object({
    name: string().min(1),
    description: string(),
    combination: string().min(1, "This field cannot be empty"),
  });
  type IValues = zodInfer<typeof schema>;

  export interface IShortcutFormSaveValues extends IValues {
    tags: ITag[]
  }
  
</script>

<script lang="ts">
  import { createForm } from "felte";
  import { validator } from "@felte/validator-zod";
  import { object, string, type infer as zodInfer } from "zod";
  import Input from "@common/Input.svelte";
  import TextArea from "@common/TextArea.svelte";
  import TagPickerInput from "@common/TagPickerInput.svelte";
  import type { ITag } from "@typings/tags.type";
  import Tag from "@common/Tag.svelte";
  import ShortcutRecorder from "@common/ShortcutRecorder.svelte";
  import { SHORTCUT_PARSER_VERSION } from "@shared-lib/consts";
  import type { IShortcut } from "@typings/shortcuts.type";
  import { tagsStore } from "@stores/tagsStore.svelte";

  interface IProps {
    id: string;
    editedShortcut?: IShortcut | null
    disabled?: boolean
    onSave: (values: IShortcutFormSaveValues) => Promise<void> | void;
  }

  const { id, disabled, onSave, editedShortcut }: IProps = $props();

  const tags = $state<ITag[]>(editedShortcut ? $tagsStore.tags.filter(tag => editedShortcut!.tagsIds.has(tag.id)) : []);
  const tagsIds = $derived(tags.map((tag) => tag.id));

  const { form, data, errors } = createForm<IValues>({
    extend: validator({ schema }),
    initialValues: {
      name: editedShortcut?.name,
      description: editedShortcut?.description,
      combination: editedShortcut?.combination,
    },
    onSubmit: (values) => onSave({ ...values, tags: $state.snapshot(tags) }),
  });
</script>

<form use:form class="flex flex-col gap-2 text-gray-900" {id}>
  <Input label="Name" name="name" errors={$errors.name} disabled={disabled} />

  <ShortcutRecorder 
    name="combination" 
    value={$data.combination} 
    errors={$errors.combination} 
    parserVersion={SHORTCUT_PARSER_VERSION} 
    disabled={disabled}
  />

  <TextArea
    class="col-span-full"
    label="Description"
    name="description"
    errors={$errors.description}
    disabled={disabled}
  />

  <div class="col-span-full">
    <TagPickerInput
      inputLabel="Tag picker"
      creatableTag
      excludeTagsByIds={tagsIds}
      disabled={disabled}
      onSubmit={(tag) => {
        const exists = tags.find((t) => t.name === tag.name);
        if (!exists) {
          tags.push(tag);
        }
      }}
    />

    <ul class="mt-2 flex flex-wrap gap-1 min-h-7">
      {#each tags as tag (tag.id)}
        <li>
          <Tag
            {tag}
            onDelete={() => {
              if (disabled) return;
              const idx = tags.findIndex((t) => t.id === tag.id);
              if (idx >= 0) {
                tags.splice(idx, 1);
              }
            }}
          />
        </li>
      {/each}
    </ul>
  </div>
</form>
