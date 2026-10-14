<script>
  import { createEventDispatcher } from "svelte";
  import { PenLine, X, LoaderCircle } from "lucide-svelte";
  import { linkTreesStore } from "../states/linkTreesStore";
  import linkTreeApi from "../api/linkTreeApi";
  import { showErrorDialog } from "../../../helpers/toolsHelper";
  import MarkdownEditor from "../components/MarkdownEditor.svelte";

  export let show = false;
  export let linkTreeId = null;
  export let onClose = undefined;

  const dispatch = createEventDispatcher();

  let loading = false;
  let fetchingLinkTree = false;
  let title = "";
  let type = "public";
  let description = "";

  function handleClose() {
    dispatch("close");
    if (onClose) onClose();
  }

  $: {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  $: if (show && linkTreeId) {
    loadLinkTreeData(linkTreeId);
  }

  async function loadLinkTreeData(id) {
    fetchingLinkTree = true;
    try {
      const tree = await linkTreeApi.getLinkTreeById(id);
      if (tree) {
        title = tree.title || "";
        type = tree.type || "public";
        description = tree.description || "";
      }
    } catch {
      showErrorDialog("Gagal mengambil data link tree");
      handleClose();
    } finally {
      fetchingLinkTree = false;
    }
  }

  $: if ($linkTreesStore.isLinkTreeChange) {
    loading = false;
    linkTreesStore.setIsLinkTreeChange(false);
    if ($linkTreesStore.isLinkTreeChanged) {
      linkTreesStore.setIsLinkTreeChanged(false);
      linkTreesStore.asyncSetLinkTrees();
      linkTreesStore.asyncSetLinkTree(linkTreeId);
      handleClose();
    }
  }

  function handleSave() {
    if (!title.trim()) {
      showErrorDialog("Judul tidak boleh kosong");
      return;
    }

    if (!description.trim()) {
      showErrorDialog("Deskripsi tidak boleh kosong");
      return;
    }

    loading = true;
    linkTreesStore.asyncSetIsLinkTreeChange(
      linkTreeId,
      title.trim(),
      type,
      description.trim()
    );
  }
</script>

{#if show}
  <div
    data-testid="edit-linktree-modal"
    class="fixed inset-0 z-50 flex flex-col bg-white animate-in fade-in duration-200 overflow-hidden"
  >
    <!-- Modal Header -->
    <div
      class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"
        >
          <PenLine size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-800">Ubah Data Link Tree</h3>
          <p class="text-xs text-slate-500">
            Perbarui judul, tipe visibilitas, dan detail deskripsi Markdown
          </p>
        </div>
      </div>
      <button
        type="button"
        data-testid="close-edit-modal-btn"
        on:click={handleClose}
        class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
      >
        <X size={20} />
      </button>
    </div>

    <!-- Modal Form Body -->
    {#if fetchingLinkTree}
      <div class="flex-1 flex flex-col items-center justify-center py-20 gap-3">
        <LoaderCircle size={32} class="animate-spin text-amber-600" />
        <p class="text-sm font-medium text-slate-500">Memuat data link tree...</p>
      </div>
    {:else}
      <form
        on:submit|preventDefault={handleSave}
        class="flex-1 flex flex-col min-h-0 bg-white"
      >
        <div class="flex-1 flex flex-col min-h-0 p-6 md:p-8 space-y-4 w-full">
          <div class="shrink-0">
            <label
              for="edit-linktree-title-input"
              class="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Judul Link Tree
            </label>
            <input
              id="edit-linktree-title-input"
              data-testid="edit-linktree-title-input"
              type="text"
              bind:value={title}
              placeholder="Masukkan judul link tree..."
              class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
            />
          </div>

          <div class="shrink-0">
            <label
              for="edit-linktree-type-select"
              class="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Tipe Visibilitas
            </label>
            <select
              id="edit-linktree-type-select"
              data-testid="edit-linktree-type-select"
              bind:value={type}
              class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all bg-white"
            >
              <option value="public">Publik</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Privat</option>
            </select>
          </div>

          <div class="flex-1 flex flex-col min-h-0">
            <span
              id="edit-linktree-desc-label"
              class="block text-sm font-semibold text-slate-700 mb-1.5 shrink-0"
            >
              Deskripsi (Markdown)
            </span>
            <div
              class="flex-1 min-h-[300px] border border-slate-200 rounded-xl overflow-hidden focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all flex flex-col"
            >
              <MarkdownEditor
                textareaTestId="edit-linktree-description-input"
                bind:value={description}
              />
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/80 shrink-0"
        >
          <button
            type="button"
            data-testid="cancel-edit-btn"
            on:click={handleClose}
            disabled={loading}
            class="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            data-testid="save-edit-btn"
            disabled={loading}
            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-md shadow-amber-600/25 transition-all disabled:opacity-50 min-w-[120px]"
          >
            {#if loading}
              <LoaderCircle size={18} class="animate-spin" />
              <span>Memperbarui...</span>
            {:else}
              <span>Perbarui</span>
            {/if}
          </button>
        </div>
      </form>
    {/if}
  </div>
{/if}
