import { describe, it, expect, vi, beforeEach } from "vitest";
import linkTreeApi from "./linkTreeApi";
import apiHelper from "../../../helpers/apiHelper";

describe("linkTreeApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("postLinkTree", () => {
    it("should create new link tree and return data", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { link_tree_id: 10 },
        }),
      });

      const res = await linkTreeApi.postLinkTree("Title", "public", "Description");
      expect(res).toEqual({ link_tree_id: 10 });
    });

    it("should throw error if creation fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      });

      await expect(
        linkTreeApi.postLinkTree("", "public", "")
      ).rejects.toThrow("Data tidak valid");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(
        linkTreeApi.postLinkTree("", "public", "")
      ).rejects.toThrow("Gagal menambahkan link tree");
    });
  });

  describe("postLinkTreeCover", () => {
    it("should upload cover with FormData and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      const msg = await linkTreeApi.postLinkTreeCover(1, dummyFile);
      expect(msg).toBe("Berhasil mengubah cover");
    });

    it("should handle cover file without name property properly", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil",
        }),
      });

      const dummyBlob = new Blob(["dummy"], { type: "image/jpeg" });
      const msg = await linkTreeApi.postLinkTreeCover(1, dummyBlob);
      expect(msg).toBe("Berhasil");
    });

    it("should throw error on upload cover fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Format tidak didukung",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(
        linkTreeApi.postLinkTreeCover(1, dummyFile)
      ).rejects.toThrow("Format tidak didukung");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(
        linkTreeApi.postLinkTreeCover(1, dummyFile)
      ).rejects.toThrow("Gagal mengubah cover");
    });
  });

  describe("putLinkTree", () => {
    it("should update link tree and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah link tree",
        }),
      });

      const res = await linkTreeApi.putLinkTree(1, "Updated Title", "private", "Desc");
      expect(res).toBe("Berhasil mengubah link tree");
    });

    it("should throw error when updating fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Update gagal",
        }),
      });

      await expect(
        linkTreeApi.putLinkTree(1, "Updated", "private", "Desc")
      ).rejects.toThrow("Update gagal");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(
        linkTreeApi.putLinkTree(1, "Updated", "private", "Desc")
      ).rejects.toThrow("Gagal mengubah link tree");
    });
  });

  describe("getLinkTrees", () => {
    it("should fetch all link trees without filter", async () => {
      const mockTrees = [{ id: 1, title: "LT 1" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { link_trees: mockTrees },
        }),
      });

      const res = await linkTreeApi.getLinkTrees();
      expect(res).toEqual(mockTrees);
    });

    it("should fetch link trees with is_me filter", async () => {
      const mockTrees = [{ id: 1, title: "My LT" }];
      const spy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { link_trees: mockTrees },
        }),
      });

      const res = await linkTreeApi.getLinkTrees("1");
      expect(res).toEqual(mockTrees);
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("is_me=1"),
        expect.any(Object)
      );
    });

    it("should return empty array when data.link_trees is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      });

      const res = await linkTreeApi.getLinkTrees();
      expect(res).toEqual([]);
    });

    it("should throw error when fetch fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Unauthorized",
        }),
      });

      await expect(linkTreeApi.getLinkTrees()).rejects.toThrow("Unauthorized");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(linkTreeApi.getLinkTrees()).rejects.toThrow(
        "Gagal mengambil data link tree"
      );
    });
  });

  describe("getLinkTreeById", () => {
    it("should return link tree detail", async () => {
      const mockTree = { id: 1, title: "Detail LT", items: [] };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { link_tree: mockTree },
        }),
      });

      const res = await linkTreeApi.getLinkTreeById(1);
      expect(res).toEqual(mockTree);
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Tidak ditemukan",
        }),
      });

      await expect(linkTreeApi.getLinkTreeById(99)).rejects.toThrow(
        "Tidak ditemukan"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(linkTreeApi.getLinkTreeById(99)).rejects.toThrow(
        "Gagal mengambil detail link tree"
      );
    });
  });

  describe("deleteLinkTree", () => {
    it("should delete link tree and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus link tree",
        }),
      });

      const res = await linkTreeApi.deleteLinkTree(1);
      expect(res).toBe("Berhasil menghapus link tree");
    });

    it("should throw error on delete fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Hapus gagal",
        }),
      });

      await expect(linkTreeApi.deleteLinkTree(1)).rejects.toThrow("Hapus gagal");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(linkTreeApi.deleteLinkTree(1)).rejects.toThrow(
        "Gagal menghapus link tree"
      );
    });
  });

  describe("deleteAllLinkTrees", () => {
    it("should delete all link trees and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus semua data link tree",
        }),
      });

      const res = await linkTreeApi.deleteAllLinkTrees();
      expect(res).toBe("Berhasil menghapus semua data link tree");
    });

    it("should throw error on delete all fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Unauthenticated.",
        }),
      });

      await expect(linkTreeApi.deleteAllLinkTrees()).rejects.toThrow(
        "Unauthenticated."
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(linkTreeApi.deleteAllLinkTrees()).rejects.toThrow(
        "Gagal menghapus semua link tree"
      );
    });
  });

  describe("postLinkTreeItem", () => {
    it("should add item and return data", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { item_id: 5 },
        }),
      });

      const res = await linkTreeApi.postLinkTreeItem(1, "Item Title", "https://delcom.org");
      expect(res).toEqual({ item_id: 5 });
    });

    it("should throw error on add item fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "URL tidak valid",
        }),
      });

      await expect(
        linkTreeApi.postLinkTreeItem(1, "", "")
      ).rejects.toThrow("URL tidak valid");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(
        linkTreeApi.postLinkTreeItem(1, "", "")
      ).rejects.toThrow("Gagal menambahkan item");
    });
  });

  describe("putLinkTreeItem", () => {
    it("should update item and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const res = await linkTreeApi.putLinkTreeItem(1, 2, "New Title", "https://example.com");
      expect(res).toBe("Berhasil mengubah data");
    });

    it("should throw error on update item fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal edit",
        }),
      });

      await expect(
        linkTreeApi.putLinkTreeItem(1, 2, "Title", "https://url")
      ).rejects.toThrow("Gagal edit");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(
        linkTreeApi.putLinkTreeItem(1, 2, "Title", "https://url")
      ).rejects.toThrow("Gagal mengubah item");
    });
  });

  describe("deleteLinkTreeItem", () => {
    it("should delete item and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus data",
        }),
      });

      const res = await linkTreeApi.deleteLinkTreeItem(1, 2);
      expect(res).toBe("Berhasil menghapus data");
    });

    it("should throw error on delete item fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Item tidak ditemukan",
        }),
      });

      await expect(
        linkTreeApi.deleteLinkTreeItem(1, 2)
      ).rejects.toThrow("Item tidak ditemukan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(
        linkTreeApi.deleteLinkTreeItem(1, 2)
      ).rejects.toThrow("Gagal menghapus item");
    });
  });
});
