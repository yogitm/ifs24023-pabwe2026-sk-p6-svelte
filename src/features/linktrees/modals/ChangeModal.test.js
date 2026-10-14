import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeModal from "./ChangeModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import linkTreeApi from "../api/linkTreeApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: false, linkTreeId: 1 },
    });
    expect(wrapper.find('[data-testid="edit-linktree-modal"]').exists()).toBe(false);
  });

  it("should load link tree data on mount and populate fields", async () => {
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValue({
      id: 1,
      title: "Existing Title",
      type: "private",
      description: "Existing Description",
    });

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1 },
    });

    await new Promise((r) => setTimeout(r, 20));

    const titleInput = wrapper.find('[data-testid="edit-linktree-title-input"]');
    expect(titleInput.element.value).toBe("Existing Title");
  });

  it("should show error and close if loadLinkTreeData fails", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    const closeSpy = vi.fn();
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockRejectedValue(new Error("Fail"));

    renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1, onClose: closeSpy },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(errorSpy).toHaveBeenCalledWith("Gagal mengambil data link tree");
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should validate empty title", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValue({
      id: 1,
      title: "Title",
      type: "public",
      description: "Desc",
    });

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1 },
    });

    await new Promise((r) => setTimeout(r, 20));

    const titleInput = wrapper.find('[data-testid="edit-linktree-title-input"]');
    await titleInput.setValue("");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Judul tidak boleh kosong");
  });

  it("should validate empty description", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValue({
      id: 1,
      title: "Title",
      type: "public",
      description: "Desc",
    });

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1 },
    });

    await new Promise((r) => setTimeout(r, 20));

    const descInput = wrapper.find('[data-testid="edit-linktree-description-input"]');
    await descInput.setValue("");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should call asyncSetIsLinkTreeChange and close on success", async () => {
    const closeSpy = vi.fn();
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValue({
      id: 1,
      title: "Title",
      type: "public",
      description: "Desc",
    });

    const { wrapper, linkTreesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1, onClose: closeSpy },
      preloadedState: {
        isLinkTreeChange: false,
        isLinkTreeChanged: false,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const changeSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeChange")
      .mockReturnValue(Promise.resolve());

    const titleInput = wrapper.find('[data-testid="edit-linktree-title-input"]');
    await titleInput.setValue("Updated Title");

    const typeSelect = wrapper.find('[data-testid="edit-linktree-type-select"]');
    await typeSelect.setValue("unlisted");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(changeSpy).toHaveBeenCalledWith(
      1,
      "Updated Title",
      "unlisted",
      "Desc"
    );

    linkTreesStore.setIsLinkTreeChange(true);
    linkTreesStore.setIsLinkTreeChanged(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle isLinkTreeChange true when isLinkTreeChanged is false", async () => {
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValue({
      id: 1,
      title: "Title",
      type: "public",
      description: "Desc",
    });

    const { wrapper, linkTreesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1 },
      preloadedState: {
        isLinkTreeChange: false,
        isLinkTreeChanged: false,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    linkTreesStore.setIsLinkTreeChange(true);
    linkTreesStore.setIsLinkTreeChanged(false);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.find('[data-testid="edit-linktree-modal"]').exists()).toBe(true);
  });

  it("should close on close and cancel buttons", async () => {
    const closeSpy = vi.fn();
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValue({
      id: 1,
      title: "Title",
      type: "public",
      description: "Desc",
    });

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1, onClose: closeSpy },
    });

    await new Promise((r) => setTimeout(r, 20));

    const closeBtn = wrapper.find('[data-testid="close-edit-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(1);

    const cancelBtn = wrapper.find('[data-testid="cancel-edit-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should close without onClose callback", async () => {
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValue({
      id: 1,
      title: "Title",
      type: "public",
      description: "Desc",
    });

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1 },
    });

    await new Promise((r) => setTimeout(r, 20));

    const closeBtn = wrapper.find('[data-testid="close-edit-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.exists()).toBe(true);
  });

  it("should handle null tree and tree with missing fields", async () => {
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValueOnce({
      id: 1,
      title: null,
      type: null,
      description: null,
    });

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1 },
    });

    await new Promise((r) => setTimeout(r, 20));
    expect(wrapper.find('[data-testid="edit-linktree-title-input"]').element.value).toBe("");

    // Test null tree
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValueOnce(null);
    renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 2 },
    });
    await new Promise((r) => setTimeout(r, 20));
  });
});
