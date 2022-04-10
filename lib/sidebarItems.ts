import { BookOpenIcon } from "@heroicons/react/solid";
import { SidebarItem } from "~/components/SidebarShell";
import { Project } from "./types";

export const getProjectSidebarItems = (id: string): SidebarItem[] => [
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

export const getProjectsSidebarItems = (
  organizations: Project[]
): SidebarItem[] => [
  {
    type: "category",
    name: "Projects",
    children: [
      {
        type: "item",
        name: "All Projects",
        href: "/app",
      },
    ],
  },
  {
    type: "category",
    name: "Organizations",
    children: organizations.map(org => {
      return {
        type: "item",
        name: org.name,
        href: `/orgs/${org.id}`,
      };
    }),
  },
  {
    type: "category",
    name: "Documentation",
    children: [
      {
        type: "item",
        name: "Guides",
        href: "https://docs.feedbackcentral.io/guides",
        icon: BookOpenIcon,
      },
    ],
  },
];
