<script lang="ts">
  import Modal from "@modules/Modal/Modal.svelte";
  import ModalHeader from "@modules/Modal/ModalHeader.svelte";
  import ShortcutEditorForm, {
    type IShortcutFormSaveValues,
  } from "./ShortcutEditorForm.svelte";
  import { SHORTCUT_PARSER_VERSION } from "@shared-lib/consts";
  import { saveShortcut, shortcutsStore } from "@stores/shortcutsStore.svelte";
  import { v4 as uuidv4 } from "uuid";
  import { addTags } from "@stores/tagsStore.svelte";
  import FieldErrors from "@common/FieldErrors.svelte";
  import Button, { BtnVariant } from "@common/Button.svelte";

  interface IProps {
    onClose: () => void;
    editedShortcutId?: string | null;
  }

  const { onClose, editedShortcutId }: IProps = $props();

  let isSaving = $state(false);
  const editedShortcut = $derived(
    editedShortcutId
      ? $shortcutsStore.shortcuts.find((el) => el.id === editedShortcutId)
      : null,
  );

  let generalError = $state<string | null>(null);

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  const handleSave = async (data: IShortcutFormSaveValues) => {
    isSaving = true;

    const resp = await window.api("shortcuts.saveOne", {
      shortcut: {
        id: editedShortcutId || uuidv4(),
        name: data.name,
        description: data.description,
        combination: data.combination,
        parserVersion: SHORTCUT_PARSER_VERSION,
      },
      tags: data.tags,
    });

    if ("data" in resp) {
      addTags(...resp.data.tags);
      saveShortcut(resp.data.shortcut);
      onClose();
    } else {
      console.error(resp);
      generalError = resp.error.message;
    }

    isSaving = false;
  };
</script>

<Modal width="500px" onClose={handleClose}>
  <ModalHeader onClose={handleClose}>Shortcut editor</ModalHeader>
  <main class="p-2" style:color="red">
    <FieldErrors class="!text-base text-center mb-2" errors={generalError} />

    <ShortcutEditorForm
      disabled={isSaving}
      id="shorctut-editor-form"
      onSave={handleSave}
      {editedShortcut}
    />
  </main>
  <footer class="p-2 flex justify-center items-center gap-2">
    <Button
      disabled={isSaving}
      variant={BtnVariant.DANGER}
      onclick={handleClose}>Cancel</Button
    >

    <Button
      disabled={isSaving}
      variant={BtnVariant.SUCCESS}
      type="submit"
      form="shorctut-editor-form"
    >
      {#if isSaving}
        Saving
      {:else}
        Save
      {/if}
    </Button>
  </footer>
</Modal>
