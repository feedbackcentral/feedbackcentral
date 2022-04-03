import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
} from "@heroicons/react/outline";

export type SidebarEntry = {
  name: string;
  href: string;
  icon: React.FC<React.ComponentProps<"svg">>;
};

// TODO Add all the sidebars
export const sidebars: Record<string, SidebarEntry[]> = {
  "/": [
    { name: "Dashboard", href: "#", icon: HomeIcon },
    { name: "Team", href: "#", icon: UsersIcon },
    { name: "Projects", href: "#", icon: FolderIcon },
    { name: "Calendar", href: "#", icon: CalendarIcon },
    { name: "Documents", href: "#", icon: InboxIcon },
    { name: "Reports", href: "#", icon: ChartBarIcon },
  ],
};
