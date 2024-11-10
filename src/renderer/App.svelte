<script lang="ts">
  import { onMount } from "svelte";
  import { tagsStore } from "@stores/tagsStore.svelte";
  import { shortcutsStore } from "@stores/shortcutsStore.svelte";
  import ShortcutsScreen from "@modules/ShortcutsScreen.svelte";

  const Status = {
    INIT: "INIT",
    READY: "READY",
    ERROR: "ERROR",
  } as const;
  type IStatus = (typeof Status)[keyof typeof Status];

  let appStatus = $state<IStatus>(Status.INIT);
  let initErrorMsg = $state("");

  onMount(async () => {
    const resp = await window.api("db.init", { dirPath: "./" });

    const tagsResp = await window.api("tags.selectAll");
    if ("error" in tagsResp) {
      window.alert(tagsResp.error.message)
    } else {
      tagsStore.set({ tags: tagsResp.data });
    }

    const shortcutsResp = await window.api("shortcuts.selectAll");
    if ("error" in shortcutsResp) {
      window.alert(shortcutsResp.error.message)
    } else {
      console.log(shortcutsResp)
      shortcutsStore.set({ shortcuts: shortcutsResp.data });
    }

    if ("error" in resp) {
      appStatus = "ERROR";
      initErrorMsg = resp.error.message;
    } else {
      appStatus = "READY";
    }
  });
</script>

{#if appStatus === Status.INIT}
  <main class="w-screen h-screen grid place-content-center fixed inset-0">
    <h1 class="text-3xl">App initializing...</h1>
  </main>
{:else if appStatus === Status.ERROR}
  <main
    class="w-screen h-screen grid place-content-center place-items-center gap-4 fixed inset-0 bg-red-50"
  >
    <h1 class="text-2xl text-red-500">
      An error has occurred when initializing the app
    </h1>
    <div class="w-24 h-[1px] bg-red-300"></div>
    <p class="text-lg text-red-500 w-4/5 text-center">{initErrorMsg}</p>
  </main>
{:else if appStatus === Status.READY}
  <div class="w-full h-full min-h-screen">
    <ShortcutsScreen />
  </div>
{/if}
