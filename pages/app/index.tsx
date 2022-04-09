import { Organization, ProjectTier } from "@feedbackcentral/types";
import { PlusIcon } from "@heroicons/react/outline";
import { BookOpenIcon } from "@heroicons/react/solid";
import { withAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";
import { ProjectCard } from "~/components/ProjectCard";
import { SidebarItem, SidebarShell } from "~/components/SidebarShell";

const ProjectsPage = () => {
  const organizations: Organization[] = [
    {
      id: "123",
      name: "Feedback Central",
      projects: [
        {
          id: "1234",
          name: "Project 1",
          description: "This is a project",
          tier: ProjectTier.FREE,
          feedbacks: [],
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2020-01-01"),
        },
        {
          id: "123",
          name: "Project 2",
          description: "This is a project",
          tier: ProjectTier.PRO,
          feedbacks: [],
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2020-01-01"),
        },
      ],
    },
    {
      id: "1234",
      name: "Supabase, Inc.",
      projects: [
        {
          id: "1235",
          name: "Project 1",
          description: "This is a project",
          tier: ProjectTier.PRO,
          feedbacks: [],
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2020-01-01"),
        },
      ],
    },
    {
      id: "12345",
      name: "Acme, Inc.",
      projects: Array(12)
        .fill(0)
        .map((_, i) => {
          return {
            id: i.toString(),
            name: `My Project ${i}`,
            description: `This is a project that was automagically generated for testing, it is number ${i} of i don't even know.`,
            tier: ProjectTier.FREE,
            feedbacks: [],
            createdAt: new Date("2020-01-01"),
            updatedAt: new Date("2020-01-01"),
          };
        }),
    },
  ];

  const getProjectSidebarItems = (): SidebarItem[] => {
    return [
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
  };

  return (
    <SidebarShell sidebarItems={getProjectSidebarItems()}>
      <div className="w-full h-full p-4">
        <button className="flex flex-row items-center content-center space-x-2 p-2 rounded bg-indigo-600 text-gray-200">
          <PlusIcon className="w-6 h-6" />
          <p className="text-sm">New Project</p>
        </button>
        <div className="flex flex-col space-y-6 mt-6">
          {organizations.map(org => (
            <div key={org.id} className="space-y-3">
              <h2 className="text-lg">{org.name}</h2>
              <ul className="grid gap-4 mx-auto grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
                {org.projects.map(project => (
                  <li key={project.id} className="col-span-1">
                    <a href={`/app/projects/${project.id}`}>
                      <ProjectCard project={project} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SidebarShell>
  );
};

export const getServerSideProps = withAuthRequired({
  redirectTo: "/auth/login",
});

export default ProjectsPage;
