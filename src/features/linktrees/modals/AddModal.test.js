import { describe, it, expect, vi, beforeEach } from "vitest";
import AddModal from "./AddModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: false },
    });
    expect(wrapper.find('[data-testid="add-linktree-modal"]').exists()).toBe(false);
  });

  it("should show validation error if title is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Judul tidak boleh kosong");
  });

  it("should show validation error if description is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true },
    });

    const titleInput = wrapper.find('[data-testid="add-linktree-title-input"]');
    await titleInput.setValue("Judul Link Tree");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should dispatch asyncSetIsLinkTreeAdd and call onClose on successful add", async () => {
    const closeSpy = vi.fn();
    const { wrapper, linkTreesStore } = renderWithProviders(AddModal, {
      props: {
        show: true,
        onClose: closeSpy,
      },
      preloadedState: {
        isLinkTreeAdd: false,
        isLinkTreeAdded: false,
      },
    });

    const asyncAddSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeAdd")
      .mockReturnValue(Promise.resolve());

    const titleInput = wrapper.find('[data-testid="add-linktree-title-input"]');
    const typeSelect = wrapper.find('[data-testid="add-linktree-type-select"]');
    const descInput = wrapper.find('[data-testid="add-linktree-description-input"]');

    await titleInput.setValue("Koleksi Portofolio");
    await typeSelect.setValue("public");
    await descInput.setValue("Tautan portofolio dan proyek saya");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(asyncAddSpy).toHaveBeenCalledWith(
      "Koleksi Portofolio",
      "public",
      "Tautan portofolio dan proyek saya"
    );

    // Simulate completion from store
    linkTreesStore.setIsLinkTreeAdd(true);
    linkTreesStore.setIsLinkTreeAdded(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle isLinkTreeAdd true when isLinkTreeAdded is false", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(AddModal, {
      props: { show: true },
      preloadedState: {
        isLinkTreeAdd: false,
        isLinkTreeAdded: false,
      },
    });

    linkTreesStore.setIsLinkTreeAdd(true);
    linkTreesStore.setIsLinkTreeAdded(false);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.find('[data-testid="add-linktree-modal"]').exists()).toBe(true);
  });

  it("should close modal when close or cancel button clicked", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(AddModal, {
      props: {
        show: true,
        onClose: closeSpy,
      },
    });

    const closeBtn = wrapper.find('[data-testid="close-add-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(1);

    const cancelBtn = wrapper.find('[data-testid="cancel-add-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should close modal without error when onClose is omitted and change type select", async () => {
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true },
    });
    const typeSelect = wrapper.find('[data-testid="add-linktree-type-select"]');
    await typeSelect.setValue("unlisted");

    const closeBtn = wrapper.find('[data-testid="close-add-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.exists()).toBe(true);
  });
});
