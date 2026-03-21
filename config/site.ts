export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Course",
  description: "",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
  ],
  navMenuItems: [
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
