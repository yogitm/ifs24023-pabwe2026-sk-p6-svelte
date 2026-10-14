import { describe, it, expect, vi, beforeEach } from "vitest";
import linkTreesStore from "./linkTreesStore";
import linkTreeApi from "../api/linkTreeApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("linkTreesStore", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    linkTreesStore.reset();
  });

  it("should have correct initial state and getters", () => {
    expect(linkTreesStore.linkTrees).toEqual([]);
    expect(linkTreesStore.linkTree).toBeNull();
    expect(linkTreesStore.isLinkTree).toBe(false);
    expect(linkTreesStore.isLinkTreeAdd).toBe(false);
    expect(linkTreesStore.isLinkTreeAdded).toBe(false);
    expect(linkTreesStore.isLinkTreeChange).toBe(false);
    expect(linkTreesStore.isLinkTreeChanged).toBe(false);
    expect(linkTreesStore.isLinkTreeChangeCover).toBe(false);
    expect(linkTreesStore.isLinkTreeChangedCover).toBe(false);
    expect(linkTreesStore.isLinkTreeDelete).toBe(false);
    expect(linkTreesStore.isLinkTreeDeleted).toBe(false);
    expect(linkTreesStore.isLinkTreeDeleteAll).toBe(false);
    expect(linkTreesStore.isLinkTreeDeletedAll).toBe(false);
    expect(linkTreesStore.isItemAdd).toBe(false);
    expect(linkTreesStore.isItemAdded).toBe(false);
    expect(linkTreesStore.isItemChange).toBe(false);
    expect(linkTreesStore.isItemChanged).toBe(false);
    expect(linkTreesStore.isItemDelete).toBe(false);
    expect(linkTreesStore.isItemDeleted).toBe(false);
    expect(linkTreesStore.$state).toBeDefined();
  });

  it("should update state with setters and reset", () => {
    linkTreesStore.setLinkTrees([{ id: 1 }]);
    expect(linkTreesStore.linkTrees).toEqual([{ id: 1 }]);

    linkTreesStore.setLinkTree({ id: 2 });
    expect(linkTreesStore.linkTree).toEqual({ id: 2 });

    linkTreesStore.setIsLinkTree(true);
    expect(linkTreesStore.isLinkTree).toBe(true);

    linkTreesStore.setIsLinkTreeAdd(true);
    expect(linkTreesStore.isLinkTreeAdd).toBe(true);

    linkTreesStore.setIsLinkTreeAdded(true);
    expect(linkTreesStore.isLinkTreeAdded).toBe(true);

    linkTreesStore.setIsLinkTreeChange(true);
    expect(linkTreesStore.isLinkTreeChange).toBe(true);

    linkTreesStore.setIsLinkTreeChanged(true);
    expect(linkTreesStore.isLinkTreeChanged).toBe(true);

    linkTreesStore.setIsLinkTreeChangeCover(true);
    expect(linkTreesStore.isLinkTreeChangeCover).toBe(true);

    linkTreesStore.setIsLinkTreeChangedCover(true);
    expect(linkTreesStore.isLinkTreeChangedCover).toBe(true);

    linkTreesStore.setIsLinkTreeDelete(true);
    expect(linkTreesStore.isLinkTreeDelete).toBe(true);

    linkTreesStore.setIsLinkTreeDeleted(true);
    expect(linkTreesStore.isLinkTreeDeleted).toBe(true);

    linkTreesStore.setIsLinkTreeDeleteAll(true);
    expect(linkTreesStore.isLinkTreeDeleteAll).toBe(true);

    linkTreesStore.setIsLinkTreeDeletedAll(true);
    expect(linkTreesStore.isLinkTreeDeletedAll).toBe(true);

    linkTreesStore.setIsItemAdd(true);
    expect(linkTreesStore.isItemAdd).toBe(true);

    linkTreesStore.setIsItemAdded(true);
    expect(linkTreesStore.isItemAdded).toBe(true);

    linkTreesStore.setIsItemChange(true);
    expect(linkTreesStore.isItemChange).toBe(true);

    linkTreesStore.setIsItemChanged(true);
    expect(linkTreesStore.isItemChanged).toBe(true);

    linkTreesStore.setIsItemDelete(true);
    expect(linkTreesStore.isItemDelete).toBe(true);

    linkTreesStore.setIsItemDeleted(true);
    expect(linkTreesStore.isItemDeleted).toBe(true);

    linkTreesStore.reset();
    expect(linkTreesStore.linkTrees).toEqual([]);
    expect(linkTreesStore.isLinkTree).toBe(false);
  });

  describe("asyncSetLinkTrees", () => {
    it("should set link trees on success", async () => {
      const trees = [{ id: 1, title: "LT" }];
      vi.spyOn(linkTreeApi, "getLinkTrees").mockResolvedValue(trees);

      await linkTreesStore.asyncSetLinkTrees();
      expect(linkTreesStore.linkTrees).toEqual(trees);
    });

    it("should set empty array on error", async () => {
      vi.spyOn(linkTreeApi, "getLinkTrees").mockRejectedValue(new Error("fail"));

      await linkTreesStore.asyncSetLinkTrees();
      expect(linkTreesStore.linkTrees).toEqual([]);
    });
  });

  describe("asyncSetLinkTree", () => {
    it("should set link tree detail and flag on success", async () => {
      const tree = { id: 1, title: "Detail LT" };
      vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValue(tree);

      await linkTreesStore.asyncSetLinkTree(1);
      expect(linkTreesStore.linkTree).toEqual(tree);
      expect(linkTreesStore.isLinkTree).toBe(true);
    });

    it("should set link tree to null on error and still set flag", async () => {
      vi.spyOn(linkTreeApi, "getLinkTreeById").mockRejectedValue(new Error("not found"));

      await linkTreesStore.asyncSetLinkTree(99);
      expect(linkTreesStore.linkTree).toBeNull();
      expect(linkTreesStore.isLinkTree).toBe(true);
    });
  });

  describe("asyncSetIsLinkTreeAdd", () => {
    it("should call api, success dialog, and update flags on success", async () => {
      vi.spyOn(linkTreeApi, "postLinkTree").mockResolvedValue({ link_tree_id: 1 });
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsLinkTreeAdd("Title", "public", "Desc");
      expect(successSpy).toHaveBeenCalledWith("Link tree berhasil ditambahkan!");
      expect(linkTreesStore.isLinkTreeAdded).toBe(true);
      expect(linkTreesStore.isLinkTreeAdd).toBe(true);
    });

    it("should call error dialog and update flags on error", async () => {
      vi.spyOn(linkTreeApi, "postLinkTree").mockRejectedValue(new Error("Invalid"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsLinkTreeAdd("", "public", "");
      expect(errorSpy).toHaveBeenCalledWith("Invalid");
      expect(linkTreesStore.isLinkTreeAdded).toBe(false);
      expect(linkTreesStore.isLinkTreeAdd).toBe(true);
    });
  });

  describe("asyncSetIsLinkTreeChange", () => {
    it("should update link tree on success", async () => {
      vi.spyOn(linkTreeApi, "putLinkTree").mockResolvedValue("Updated");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsLinkTreeChange(1, "New", "private", "Desc");
      expect(successSpy).toHaveBeenCalledWith("Link tree berhasil diperbarui!");
      expect(linkTreesStore.isLinkTreeChanged).toBe(true);
      expect(linkTreesStore.isLinkTreeChange).toBe(true);
    });

    it("should call error dialog on error", async () => {
      vi.spyOn(linkTreeApi, "putLinkTree").mockRejectedValue(new Error("Update failed"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsLinkTreeChange(1, "New", "private", "Desc");
      expect(errorSpy).toHaveBeenCalledWith("Update failed");
      expect(linkTreesStore.isLinkTreeChanged).toBe(false);
      expect(linkTreesStore.isLinkTreeChange).toBe(true);
    });
  });

  describe("asyncSetIsLinkTreeChangeCover", () => {
    it("should upload cover on success", async () => {
      vi.spyOn(linkTreeApi, "postLinkTreeCover").mockResolvedValue("Cover changed");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsLinkTreeChangeCover(1, new Blob());
      expect(successSpy).toHaveBeenCalledWith("Cover berhasil diubah!");
      expect(linkTreesStore.isLinkTreeChangedCover).toBe(true);
      expect(linkTreesStore.isLinkTreeChangeCover).toBe(true);
    });

    it("should call error dialog on error", async () => {
      vi.spyOn(linkTreeApi, "postLinkTreeCover").mockRejectedValue(new Error("Cover error"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsLinkTreeChangeCover(1, new Blob());
      expect(errorSpy).toHaveBeenCalledWith("Cover error");
      expect(linkTreesStore.isLinkTreeChangedCover).toBe(false);
      expect(linkTreesStore.isLinkTreeChangeCover).toBe(true);
    });
  });

  describe("asyncSetIsLinkTreeDelete", () => {
    it("should delete link tree on success", async () => {
      vi.spyOn(linkTreeApi, "deleteLinkTree").mockResolvedValue("Deleted");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsLinkTreeDelete(1);
      expect(successSpy).toHaveBeenCalledWith("Link tree berhasil dihapus!");
      expect(linkTreesStore.isLinkTreeDeleted).toBe(true);
      expect(linkTreesStore.isLinkTreeDelete).toBe(true);
    });

    it("should call error dialog on error", async () => {
      vi.spyOn(linkTreeApi, "deleteLinkTree").mockRejectedValue(new Error("Delete failed"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsLinkTreeDelete(1);
      expect(errorSpy).toHaveBeenCalledWith("Delete failed");
      expect(linkTreesStore.isLinkTreeDeleted).toBe(false);
      expect(linkTreesStore.isLinkTreeDelete).toBe(true);
    });
  });

  describe("asyncSetIsLinkTreeDeleteAll", () => {
    it("should delete all link trees on success", async () => {
      vi.spyOn(linkTreeApi, "deleteAllLinkTrees").mockResolvedValue("Deleted all");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsLinkTreeDeleteAll();
      expect(successSpy).toHaveBeenCalledWith("Semua link tree berhasil dihapus!");
      expect(linkTreesStore.isLinkTreeDeletedAll).toBe(true);
      expect(linkTreesStore.isLinkTreeDeleteAll).toBe(true);
    });

    it("should call error dialog on error", async () => {
      vi.spyOn(linkTreeApi, "deleteAllLinkTrees").mockRejectedValue(new Error("Delete all failed"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsLinkTreeDeleteAll();
      expect(errorSpy).toHaveBeenCalledWith("Delete all failed");
      expect(linkTreesStore.isLinkTreeDeletedAll).toBe(false);
      expect(linkTreesStore.isLinkTreeDeleteAll).toBe(true);
    });
  });

  describe("asyncSetIsItemAdd", () => {
    it("should add item on success", async () => {
      vi.spyOn(linkTreeApi, "postLinkTreeItem").mockResolvedValue({ item_id: 1 });
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsItemAdd(1, "Link Item", "https://delcom.org");
      expect(successSpy).toHaveBeenCalledWith("Item tautan berhasil ditambahkan!");
      expect(linkTreesStore.isItemAdded).toBe(true);
      expect(linkTreesStore.isItemAdd).toBe(true);
    });

    it("should call error dialog on error", async () => {
      vi.spyOn(linkTreeApi, "postLinkTreeItem").mockRejectedValue(new Error("Item failed"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsItemAdd(1, "", "");
      expect(errorSpy).toHaveBeenCalledWith("Item failed");
      expect(linkTreesStore.isItemAdded).toBe(false);
      expect(linkTreesStore.isItemAdd).toBe(true);
    });
  });

  describe("asyncSetIsItemChange", () => {
    it("should update item on success", async () => {
      vi.spyOn(linkTreeApi, "putLinkTreeItem").mockResolvedValue("Item updated");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsItemChange(1, 2, "Updated", "https://delcom.org");
      expect(successSpy).toHaveBeenCalledWith("Item tautan berhasil diperbarui!");
      expect(linkTreesStore.isItemChanged).toBe(true);
      expect(linkTreesStore.isItemChange).toBe(true);
    });

    it("should call error dialog on error", async () => {
      vi.spyOn(linkTreeApi, "putLinkTreeItem").mockRejectedValue(new Error("Edit failed"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsItemChange(1, 2, "Updated", "https://delcom.org");
      expect(errorSpy).toHaveBeenCalledWith("Edit failed");
      expect(linkTreesStore.isItemChanged).toBe(false);
      expect(linkTreesStore.isItemChange).toBe(true);
    });
  });

  describe("asyncSetIsItemDelete", () => {
    it("should delete item on success", async () => {
      vi.spyOn(linkTreeApi, "deleteLinkTreeItem").mockResolvedValue("Item deleted");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsItemDelete(1, 2);
      expect(successSpy).toHaveBeenCalledWith("Item tautan berhasil dihapus!");
      expect(linkTreesStore.isItemDeleted).toBe(true);
      expect(linkTreesStore.isItemDelete).toBe(true);
    });

    it("should call error dialog on error", async () => {
      vi.spyOn(linkTreeApi, "deleteLinkTreeItem").mockRejectedValue(new Error("Delete item failed"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await linkTreesStore.asyncSetIsItemDelete(1, 2);
      expect(errorSpy).toHaveBeenCalledWith("Delete item failed");
      expect(linkTreesStore.isItemDeleted).toBe(false);
      expect(linkTreesStore.isItemDelete).toBe(true);
    });
  });
});
