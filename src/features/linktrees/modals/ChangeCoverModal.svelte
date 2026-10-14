<script>
  import { createEventDispatcher } from "svelte";
  import { ImagePlus, X, LoaderCircle, Upload } from "lucide-svelte";
  import { linkTreesStore } from "../states/linkTreesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";

  export let show = false;
  export let linkTree = null;
  export let onClose = undefined;

  const dispatch = createEventDispatcher();

  let loading = false;
  let file = null;
  let previewUrl = null;

  function handleClose() {
    previewUrl = null;
    file = null;
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

  $: if ($linkTreesStore.isLinkTreeChangeCover) {
    loading = false;
    linkTreesStore.setIsLinkTreeChangeCover(false);
    if ($linkTreesStore.isLinkTreeChangedCover) {
      linkTreesStore.setIsLinkTreeChangedCover(false);
      if (linkTree?.id) {
        linkTreesStore.asyncSetLinkTree(linkTree.id);
      }
      handleClose();
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showErrorDialog("Pilih file gambar (JPG/PNG)!");
      return;
    }

    if (selectedFile.size > 1024 * 1024) {
      showErrorDialog("Ukuran gambar maksimal 1MB!");
      return;
    }

    file = selectedFile;
    previewUrl = URL.createObjectURL(selectedFile);
  }

  function handleSave() {
    if (!file) {
      showErrorDialog("Silakan pilih cover baru!");
      return;
    }

    loading = true;
    linkTreesStore.asyncSetIsLinkTreeChangeCover(linkTree.id, file);
  }
</script>

{#if show && linkTree}
  <div
    data-testid="change-cover-modal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
    >
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center"
          >
            <ImagePlus size={18} strokeWidth={2.5} />
          </div>
          <h3 class="text-base font-bold text-slate-800">Ubah Cover Link Tree</h3>
        </div>
        <button
          type="button"
          data-testid="close-cover-modal-btn"
          on:click={handleClose}
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <form on:submit|preventDefault={handleSave} class="p-6 space-y-4">
        <div>
          <span class="block text-sm font-semibold text-slate-700 mb-2">
            Pilih Gambar Cover
          </span>

          <label
            for="linktree-cover-file-input"
            class="group relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition-all overflow-hidden"
          >
            {#if previewUrl}
              <img
                src={previewUrl}
                alt="Pratinjau Cover"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <p class="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Upload size={14} /> Ganti File
                </p>
              </div>
            {:else if linkTree?.cover}
              <img
                src={linkTree.cover}
                alt="Cover Saat Ini"
                class="w-full h-full object-cover opacity-80"
              />
              <div
                class="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center p-4 text-center text-white"
              >
                <Upload size={24} class="mb-1" />
                <p class="text-xs font-semibold">Klik untuk memilih gambar baru</p>
                <p class="text-[10px] text-slate-200 mt-0.5">Maks. 1MB (JPG/PNG)</p>
              </div>
            {:else}
              <div class="flex flex-col items-center justify-center p-4 text-center">
                <div
                  class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2"
                >
                  <Upload size={18} />
                </div>
                <p class="text-xs font-semibold text-slate-700">Pilih berkas gambar</p>
                <p class="text-[10px] text-slate-400 mt-1">Format PNG, JPG, JPEG (Maks. 1MB)</p>
              </div>
            {/if}

            <input
              id="linktree-cover-file-input"
              data-testid="cover-file-input"
              type="file"
              accept="image/*"
              on:change={handleFileChange}
              class="hidden"
            />
          </label>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            data-testid="cancel-cover-btn"
            on:click={handleClose}
            disabled={loading}
            class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            data-testid="save-cover-btn"
            disabled={loading}
            class="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 min-w-[100px]"
          >
            {#if loading}
              <LoaderCircle size={14} class="animate-spin" />
              <span>Mengunggah...</span>
            {:else}
              <span>Simpan Cover</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
