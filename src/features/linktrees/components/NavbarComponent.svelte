<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { navigate } from "../../../router.js";
  import {
    Link,
    User,
    LogOut,
    ChevronDown,
    Menu,
    X,
  } from "lucide-svelte";

  export let profile = null;
  export let isSidebarOpen = false;
  export let onToggleSidebar = undefined;
  export let onLogout = undefined;

  const dispatch = createEventDispatcher();

  let dropdownOpen = false;
  let dropdownRef;

  function handleClickOutside(event) {
    if (dropdownRef && !dropdownRef.contains(event.target)) {
      dropdownOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener("mousedown", handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener("mousedown", handleClickOutside);
  });

  function handleProfileClick() {
    dropdownOpen = false;
    navigate("/profile");
  }

  function handleLogoutClick() {
    dropdownOpen = false;
    dispatch("logout");
    if (onLogout) onLogout();
  }
</script>

<header
  class="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all"
>
  <div
    class="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"
  >
    <div class="flex items-center gap-3">
      <button
        type="button"
        data-testid="toggle-sidebar-btn"
        on:click={() => {
          dispatch("toggle-sidebar");
          if (onToggleSidebar) onToggleSidebar();
        }}
        class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        aria-label="Toggle Navigation"
      >
        {#if isSidebarOpen}
          <X size={20} />
        {:else}
          <Menu size={20} />
        {/if}
      </button>

      <a
        href="/"
        on:click|preventDefault={() => navigate("/")}
        class="flex items-center gap-3 group"
      >
        <div
          class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform"
        >
          <Link size={22} strokeWidth={2.5} />
        </div>
        <div>
          <span
            class="text-lg font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent"
          >
            Delcom Link Tree
          </span>
        </div>
      </a>
    </div>

    <!-- Profile User Dropdown -->
    <div class="relative" bind:this={dropdownRef}>
      <button
        type="button"
        data-testid="profile-dropdown-button"
        on:click={() => (dropdownOpen = !dropdownOpen)}
        class="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        {#if profile?.photo}
          <img
            src={profile.photo}
            alt={profile.name || "Foto Pengguna"}
            class="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
        {:else}
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-xs"
          >
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
        {/if}

        <div class="hidden sm:block text-left">
          <p class="text-xs font-semibold text-slate-800 leading-tight">
            {profile?.name || "Pengguna"}
          </p>
          <p class="text-[10px] text-slate-500 leading-tight">
            {profile?.email || ""}
          </p>
        </div>

        <ChevronDown
          size={14}
          class="text-slate-400 transition-transform {dropdownOpen
            ? 'rotate-180'
            : ''}"
        />
      </button>

      {#if dropdownOpen}
        <div
          class="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div class="px-4 py-2 border-b border-slate-100 sm:hidden">
            <p class="text-xs font-semibold text-slate-800">
              {profile?.name || "Pengguna"}
            </p>
            <p class="text-[10px] text-slate-500 truncate">
              {profile?.email || ""}
            </p>
          </div>

          <button
            type="button"
            data-testid="profile-menu-item"
            on:click={handleProfileClick}
            class="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
          >
            <User size={15} />
            <span>Lihat Profil</span>
          </button>

          <button
            type="button"
            data-testid="logout-menu-item"
            on:click={handleLogoutClick}
            class="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/80 transition-colors"
          >
            <LogOut size={15} />
            <span>Keluar Akun</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
</header>
