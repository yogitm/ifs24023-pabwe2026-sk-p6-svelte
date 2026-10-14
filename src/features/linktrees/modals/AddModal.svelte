<script>
  import { createEventDispatcher } from "svelte";
  import { Plus, X, LoaderCircle } from "lucide-svelte";
  import { linkTreesStore } from "../states/linkTreesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";
  import MarkdownEditor from "../components/MarkdownEditor.svelte";

  export let show = false;
  export let onClose = undefined;

  const dispatch = createEventDispatcher();

  let loading = false;
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

  $: if ($linkTreesStore.isLinkTreeAdd) {
    loading = false;
    linkTreesStore.setIsLinkTreeAdd(false);
    if ($linkTreesStore.isLinkTreeAdded) {
      linkTreesStore.setIsLinkTreeAdded(false);
      linkTreesStore.asyncSetLinkTrees();
      title = "";
      type = "public";
      description = "";
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
    linkTreesStore.asyncSetIsLinkTreeAdd(title.trim(), type, description.trim());
  }
</script>

{#if show}
  <div
    data-testid="add-linktree-modal"
    class="fixed inset-0 z-50 flex flex-col bg-white animate-in fade-in duration-200 overflow-hidden"
  >
    <!-- Modal Header -->
    <div
      class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center"
        >
          <Plus size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-800">Tambah Link Tree Baru</h3>
          <p class="text-xs text-slate-500">
            Buat halaman kumpulan tautan baru dengan format Markdown
          </p>
        </div>
      </div>
      <button
        type="button"
        data-testid="close-add-modal-btn"
        on:click={handleClose}
        class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
      >
        <X size={20} />
      </button>
    </div>

    <!-- Modal Form Body -->
    <form
      on:submit|preventDefault={handleSave}
      class="flex-1 flex flex-col min-h-0 bg-white"
    >
      <div class="flex-1 flex flex-col min-h-0 p-6 md:p-8 space-y-4 w-full">
        <div class="shrink-0">
          <label
            for="add-linktree-title-input"
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Judul Link Tree
          </label>
          <input
            id="add-linktree-title-input"
            data-testid="add-linktree-title-input"
            type="text"
            bind:value={title}
            placeholder="Masukkan judul kumpulan tautan..."
            class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
          />
        </div>

        <div class="shrink-0">
          <label
            for="add-linktree-type-select"
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Tipe Visibilitas
          </label>
          <select
            id="add-linktree-type-select"
            data-testid="add-linktree-type-select"
            bind:value={type}
            class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
          >
            <option value="public">Publik (Terbuka untuk semua)</option>
            <option value="unlisted">Unlisted (Hanya lewat tautan)</option>
            <option value="private">Privat (Hanya untuk Anda)</option>
          </select>
        </div>

        <div class="flex-1 flex flex-col min-h-0">
          <span
            id="add-linktree-desc-label"
            class="block text-sm font-semibold text-slate-700 mb-1.5 shrink-0"
          >
            Deskripsi (Markdown)
          </span>
          <div
            class="flex-1 min-h-[300px] border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all flex flex-col"
          >
            <MarkdownEditor
              textareaTestId="add-linktree-description-input"
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
          data-testid="cancel-add-btn"
          on:click={handleClose}
          disabled={loading}
          class="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-all disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          data-testid="save-add-btn"
          disabled={loading}
          class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 min-w-[120px]"
        >
          {#if loading}
            <LoaderCircle size={18} class="animate-spin" />
            <span>Menyimpan...</span>
          {:else}
            <span>Simpan</span>
          {/if}
        </button>
      </div>
    </form>
  </div>
{/if}
