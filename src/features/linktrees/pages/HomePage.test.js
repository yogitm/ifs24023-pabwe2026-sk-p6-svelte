import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./HomePage.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as routerModule from "../../../router";
import { linkTreesStore } from "../states/linkTreesStore";

describe("HomePage", () => {
  const mockProfile = { id: 1, name: "Abdullah", email: "abdul@del.org" };
  const mockLinkTrees = [
    {
      id: 1,
      title: "Link Tree Pertama",
      description: "Deskripsi pertama",
      type: "public",
      cover: "https://example.com/cover1.jpg",
      total_links: 2,
      author: { name: "Abdullah Ubaid", photo: "https://example.com/abdul.jpg" },
      created_at: "2024-02-26T02:34:26.000000Z",
      updated_at: "2024-02-26T02:44:47.000000Z",
    },
    {
      id: 2,
      title: "Link Tree Unlisted",
      description: "Deskripsi kedua",
      type: "unlisted",
      cover: null,
      total_links: 0,
      author: null,
      created_at: "2024-02-26T02:34:26.000000Z",
      updated_at: "2024-02-26T02:44:47.000000Z",
    },
    {
      id: 3,
      title: "Link Tree Privat",
      description: null,
      type: "private",
      cover: null,
      total_links: 1,
      author: { name: "Budi" },
      created_at: "2024-02-26T02:34:26.000000Z",
      updated_at: "2024-02-26T02:44:47.000000Z",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(linkTreesStore, "asyncSetLinkTrees").mockImplementation(() => Promise.resolve());
  });

  it("should return null/empty if profile is not present", () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: { profile: null },
    });
    expect(wrapper.find('[data-testid="add-link-tree-btn"]').exists()).toBe(false);
  });

  it("should render link tree stats, rows, and empty state when empty", async () => {
    vi.spyOn(linkTreesStore, "asyncSetLinkTrees").mockResolvedValue();

    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: [],
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Daftar Link Tree");
    expect(wrapper.text()).toContain("Belum ada data link tree yang cocok.");
  });

  it("should display loading indicator while loading link trees", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: [],
      },
    });

    vi.spyOn(linkTreesStore, "asyncSetLinkTrees").mockReturnValue(new Promise(() => {}));
    const filterMeBtn = wrapper.find('[data-testid="filter-me-btn"]');
    await filterMeBtn.trigger("click");

    expect(wrapper.text()).toContain("Memuat daftar link tree...");
  });

  it("should display stats count and filter/search link trees", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Total Link Tree");
    expect(wrapper.text()).toContain("Link Tree Pertama");
    expect(wrapper.text()).toContain("Link Tree Unlisted");
    expect(wrapper.text()).toContain("Link Tree Privat");

    // Test search filter by title
    const searchInput = wrapper.find('[data-testid="search-link-tree-input"]');
    await searchInput.setValue("Pertama");

    expect(wrapper.text()).toContain("Link Tree Pertama");
    expect(wrapper.text()).not.toContain("Link Tree Unlisted");

    // Test search filter by description
    await searchInput.setValue("kedua");
    expect(wrapper.text()).toContain("Link Tree Unlisted");

    // Test filter buttons
    const filterMeBtn = wrapper.find('[data-testid="filter-me-btn"]');
    await filterMeBtn.trigger("click");

    const filterAllBtn = wrapper.find('[data-testid="filter-all-btn"]');
    await filterAllBtn.trigger("click");
  });

  it("should handle search against link trees with null title and description", async () => {
    vi.spyOn(toolsHelper, "formatDate").mockReturnValue("-");
    vi.spyOn(linkTreesStore, "asyncSetLinkTrees").mockResolvedValue();

    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: [{ id: 99, title: null, description: null, type: "public" }],
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    const searchInput = wrapper.find('[data-testid="search-link-tree-input"]');
    await searchInput.setValue("xyz");
    expect(wrapper.text()).toContain("Belum ada data link tree yang cocok.");
  });

  it("should open and close AddModal when Tambah Link Tree button clicked", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const addBtn = wrapper.find('[data-testid="add-link-tree-btn"]');
    await addBtn.trigger("click");

    expect(wrapper.find('[data-testid="add-linktree-modal"]').exists()).toBe(true);

    const closeBtn = wrapper.find('[data-testid="close-add-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.find('[data-testid="add-linktree-modal"]').exists()).toBe(false);
  });

  it("should navigate to detail page when view icon clicked", async () => {
    const navSpy = vi.spyOn(routerModule, "navigate").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    navSpy.mockClear();
    await new Promise((r) => setTimeout(r, 20));

    const viewBtn = wrapper.find('[data-testid="view-link-tree-1"]');
    await viewBtn.trigger("click");

    expect(navSpy).toHaveBeenCalledWith("/link-trees/1");
  });

  it("should open and close edit modal when edit icon clicked", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const editBtn = wrapper.find('[data-testid="edit-link-tree-1"]');
    await editBtn.trigger("click");

    expect(wrapper.find('[data-testid="edit-linktree-modal"]').exists()).toBe(true);

    const closeBtn = wrapper.find('[data-testid="close-edit-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.find('[data-testid="edit-linktree-modal"]').exists()).toBe(false);
  });

  it("should trigger confirm dialog and dispatch delete when delete icon confirmed", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteActionSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeDelete")
      .mockReturnValue(Promise.resolve());

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true });

    const deleteBtn = wrapper.find('[data-testid="delete-link-tree-1"]');
    await deleteBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(deleteActionSpy).toHaveBeenCalledWith(1);
  });

  it("should not dispatch delete when cancelled", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteActionSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeDelete")
      .mockReturnValue(Promise.resolve());

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false });

    const deleteBtn = wrapper.find('[data-testid="delete-link-tree-1"]');
    await deleteBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    expect(deleteActionSpy).not.toHaveBeenCalled();
  });

  it("should trigger confirm dialog and dispatch deleteAll when delete all clicked and confirmed", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteAllSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeDeleteAll")
      .mockReturnValue(Promise.resolve());

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true });

    const deleteAllBtn = wrapper.find('[data-testid="delete-all-link-trees-btn"]');
    await deleteAllBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(deleteAllSpy).toHaveBeenCalled();
  });

  it("should not dispatch deleteAll when cancelled", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteAllSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeDeleteAll")
      .mockReturnValue(Promise.resolve());

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false });

    const deleteAllBtn = wrapper.find('[data-testid="delete-all-link-trees-btn"]');
    await deleteAllBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(deleteAllSpy).not.toHaveBeenCalled();
  });

  it("should reload link trees when isLinkTreeDeleted is true", async () => {
    const { linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
        isLinkTreeDeleted: false,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const asyncSetLinkTreesSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTrees")
      .mockReturnValue(Promise.resolve());

    linkTreesStore.setIsLinkTreeDeleted(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(asyncSetLinkTreesSpy).toHaveBeenCalled();
  });

  it("should reload link trees when isLinkTreeDeletedAll is true", async () => {
    const { linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
        isLinkTreeDeletedAll: false,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const asyncSetLinkTreesSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTrees")
      .mockReturnValue(Promise.resolve());

    linkTreesStore.setIsLinkTreeDeletedAll(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(asyncSetLinkTreesSpy).toHaveBeenCalled();
  });

  it("should not update loading state after unmount", async () => {
    let resolveLoad;
    const pendingPromise = new Promise((resolve) => {
      resolveLoad = resolve;
    });

    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: { profile: mockProfile, linkTrees: [] },
    });

    vi.spyOn(linkTreesStore, "asyncSetLinkTrees").mockReturnValue(pendingPromise);

    const filterMeBtn = wrapper.find('[data-testid="filter-me-btn"]');
    await filterMeBtn.trigger("click");

    wrapper.unmount();
    resolveLoad();
    await pendingPromise;
  });

  it("should handle null linkTrees store gracefully", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: null,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Belum ada data link tree");
  });

  it("should render row correctly when link tree has null total_links, null author, null description, and unlisted type", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: [
          {
            id: 99,
            title: "Link Tree Null Total",
            description: null,
            type: "unlisted",
            cover: null,
            total_links: null,
            author: { name: null },
            created_at: "2024-02-26T02:34:26.000000Z",
          },
        ],
      },
    });

    await new Promise((r) => setTimeout(r, 20));
    expect(wrapper.text()).toContain("Link Tree Null Total");
    expect(wrapper.text()).toContain("0");
  });
});
