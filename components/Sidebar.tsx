import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

interface SidebarElementProps {
  name: string;
  active?: boolean;
  icon?: string;
}

const SidebarElement = ({ name, icon, active }: SidebarElementProps) => (
  <Fragment>
    {icon && <Icon icon={icon} />}
    <span className="ml-3">{name}</span>
  </Fragment>
);

export const SidebarProject = () => {
  const router = useRouter();
  return (
    <aside
      className="w-64 h-screen bg-primary overflow-y-auto py-4 px-3 rounded <md:hidden"
      aria-label="Sidebar"
    >
      <ul className="space-y-2">
        <li>
          <Link href={`/projects/${router.query.uuid}`}>
            <a
              className={`
              flex
              items-center
              p-2
              text-gray-900
              rounded-lg
              hover:bg-gray-200
              cursor-pointer
              ${router.pathname === "/projects/[uuid]" ? "bg-gray-200" : ""}
            `}
            >
              <SidebarElement
                name="Overview"
                active={router.pathname === "/projects/[uuid]"}
              />
            </a>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export const SidebarProfile = () => {
  const router = useRouter();
  return (
    <aside
      className="w-64 h-screen bg-primary overflow-y-auto py-4 px-3 rounded <md:hidden"
      aria-label="Sidebar"
    >
      <ul className="space-y-2">
        <li>
          <Link href="/profile">
            <a
              className={`
              flex
              items-center
              p-2
              text-gray-900
              rounded-lg
              hover:bg-gray-200
              cursor-pointer
              ${router.pathname === "/profile" ? "bg-gray-200" : ""}
            `}
            >
              <SidebarElement
                name="All projects"
                active={router.pathname === "/profile"}
              />
            </a>
          </Link>
        </li>
      </ul>
    </aside>
  );
};
