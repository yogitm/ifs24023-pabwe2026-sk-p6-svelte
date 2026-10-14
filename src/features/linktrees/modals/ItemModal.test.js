import { describe, it, expect, vi, beforeEach } from "vitest";
import ItemModal from "./ItemModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("ItemModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: false, linkTreeId: 1 },
    });
    expect(wrapper.find('[data-testid="item-modal"]').exists()).toBe(false);
  });

  it("should validate empty title and url when adding", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1 },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(errorSpy).toHaveBeenCalledWith("Judul tautan tidak boleh kosong");

    const titleInput = wrapper.find('[data-testid="item-title-input"]');
    await titleInput.setValue("Instagram");

    await form.trigger("submit");
    expect(errorSpy).toHaveBeenCalledWith("URL tautan tidak boleh kosong");
  });

  it("should dispatch asyncSetIsItemAdd when item is null and close on completion", async () => {
    const closeSpy = vi.fn();
    const { wrapper, linkTreesStore } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1, item: null, onClose: closeSpy },
      preloadedState: {
        isItemAdd: false,
        isItemAdded: false,
      },
    });

    const addSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsItemAdd")
      .mockReturnValue(Promise.resolve());
    const setTreeSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTree")
      .mockReturnValue(Promise.resolve());

    const titleInput = wrapper.find('[data-testid="item-title-input"]');
    const urlInput = wrapper.find('[data-testid="item-url-input"]');

    await titleInput.setValue("GitHub Profil");
    await urlInput.setValue("https://github.com/myprofile");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(addSpy).toHaveBeenCalledWith(
      1,
      "GitHub Profil",
      "https://github.com/myprofile"
    );

    linkTreesStore.setIsItemAdd(true);
    linkTreesStore.setIsItemAdded(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(setTreeSpy).toHaveBeenCalledWith(1);
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should prefill fields and dispatch asyncSetIsItemChange when item is provided", async () => {
    const closeSpy = vi.fn();
    const mockItem = { id: 7, title: "Old Title", url: "https://old.url" };

    const { wrapper, linkTreesStore } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 2, item: mockItem, onClose: closeSpy },
      preloadedState: {
        isItemChange: false,
        isItemChanged: false,
      },
    });

    const titleInput = wrapper.find('[data-testid="item-title-input"]');
    const urlInput = wrapper.find('[data-testid="item-url-input"]');
    expect(titleInput.element.value).toBe("Old Title");
    expect(urlInput.element.value).toBe("https://old.url");

    const changeSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsItemChange")
      .mockReturnValue(Promise.resolve());
    const setTreeSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTree")
      .mockReturnValue(Promise.resolve());

    await titleInput.setValue("New Title");
    await urlInput.setValue("https://new.url");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(changeSpy).toHaveBeenCalledWith(
      2,
      7,
      "New Title",
      "https://new.url"
    );

    linkTreesStore.setIsItemChange(true);
    linkTreesStore.setIsItemChanged(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(setTreeSpy).toHaveBeenCalledWith(2);
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle isItemAdd or isItemChange true when Added/Changed is false", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1 },
      preloadedState: {
        isItemAdd: false,
        isItemAdded: false,
        isItemChange: false,
        isItemChanged: false,
      },
    });

    linkTreesStore.setIsItemAdd(true);
    linkTreesStore.setIsItemAdded(false);
    await new Promise((r) => setTimeout(r, 10));
    expect(wrapper.find('[data-testid="item-modal"]').exists()).toBe(true);

    linkTreesStore.setIsItemChange(true);
    linkTreesStore.setIsItemChanged(false);
    await new Promise((r) => setTimeout(r, 10));
    expect(wrapper.find('[data-testid="item-modal"]').exists()).toBe(true);
  });

  it("should close on cancel and close buttons", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1, onClose: closeSpy },
    });

    const closeBtn = wrapper.find('[data-testid="close-item-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(1);

    const cancelBtn = wrapper.find('[data-testid="cancel-item-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should handle item with null title and url", () => {
    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1, item: { id: 10, title: null, url: null } },
    });

    const titleInput = wrapper.find('[data-testid="item-title-input"]');
    const urlInput = wrapper.find('[data-testid="item-url-input"]');
    expect(titleInput.element.value).toBe("");
    expect(urlInput.element.value).toBe("");
  });

  it("should handle close without onClose callback", async () => {
    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1 },
    });

    const closeBtn = wrapper.find('[data-testid="close-item-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.exists()).toBe(true);
  });

  it("should handle isItemAdded and isItemChanged when linkTreeId is null", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: null },
      preloadedState: {
        isItemAdd: false,
        isItemAdded: false,
        isItemChange: false,
        isItemChanged: false,
      },
    });

    const setTreeSpy = vi.spyOn(linkTreesStore, "asyncSetLinkTree");

    linkTreesStore.setIsItemAdd(true);
    linkTreesStore.setIsItemAdded(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(setTreeSpy).not.toHaveBeenCalled();

    linkTreesStore.setIsItemChange(true);
    linkTreesStore.setIsItemChanged(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(setTreeSpy).not.toHaveBeenCalled();
  });
});
