import { SidebarItem } from "~/components/SidebarShell";

export const getSidebarItems = (id: string): SidebarItem[] => [
  {
    type: "item",
    name: "Overview",
    href: `/app/projects/${id}`,
  },
  {
    type: "item",
    name: "Messages",
    href: `/app/projects/${id}/messages`,
  },
  {
    type: "item",
    name: "Settings",
    href: `/app/projects/${id}/settings`,
  },
];
