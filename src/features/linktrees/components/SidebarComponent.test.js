import { describe, it, expect, vi, beforeEach } from "vitest";
import SidebarComponent from "./SidebarComponent.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as routerModule from "../../../router";

describe("SidebarComponent", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render navigation items", () => {
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/",
      props: {
        isSidebarOpen: false,
      },
    });

    expect(wrapper.text()).toContain("Semua Link Tree");
    expect(wrapper.text()).toContain("Semua Pengguna");
    expect(wrapper.text()).toContain("Profil Saya");
  });

  it("should navigate when link is clicked and close mobile", async () => {
    const navSpy = vi.spyOn(routerModule, "navigate").mockImplementation(() => {});
    const closeSpy = vi.fn();

    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/",
      props: {
        isSidebarOpen: true,
        onCloseMobile: closeSpy,
      },
    });

    const links = wrapper.findAll("a");
    await links[1].trigger("click"); // Semua Pengguna

    expect(navSpy).toHaveBeenCalledWith("/users");
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should close mobile menu on backdrop click and on escape keydown", async () => {
    const closeSpy = vi.fn();

    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/",
      props: {
        isSidebarOpen: true,
        onCloseMobile: closeSpy,
      },
    });

    const backdrop = wrapper.find('[data-testid="sidebar-backdrop"]');
    expect(backdrop.exists()).toBe(true);

    await backdrop.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(1);

    await backdrop.trigger("keydown", { key: "Escape" });
    expect(closeSpy).toHaveBeenCalledTimes(2);

    await backdrop.trigger("keydown", { key: "Enter" });
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should highlight active item according to current route", () => {
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/users",
      props: {
        isSidebarOpen: false,
      },
    });

    const links = wrapper.findAll("a");
    expect(links[1].classes()).toContain("bg-indigo-600");
  });

  it("should handle navigation and backdrop click when onCloseMobile is omitted", async () => {
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/",
      props: {
        isSidebarOpen: true,
      },
    });

    const links = wrapper.findAll("a");
    await links[0].trigger("click");

    const backdrop = wrapper.find('[data-testid="sidebar-backdrop"]');
    await backdrop.trigger("click");
    await backdrop.trigger("keydown", { key: "Escape" });
    expect(wrapper.exists()).toBe(true);
  });
});
