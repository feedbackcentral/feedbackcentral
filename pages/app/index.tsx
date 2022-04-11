import { Profile, Project } from "@feedbackcentral/types";
import { PlusIcon } from "@heroicons/react/outline";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProjectCard } from "~/components/ProjectCard";
import { SidebarShell } from "~/components/SidebarShell";
import { getProjectsSidebarItems } from "~/lib/sidebarItems";

const ProjectsPage: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabaseClient
      .from<Project>("projects")
      .select("*")
      .eq("owner_id", user.id)
      .then(({ data: projects }) => {
        if (!projects) return;
        setProjects(projects);
      });
    supabaseClient
      .from<Profile>("users")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data: profile }) => {
        if (!profile) return;
        setProfile(profile);
      });
  }, []);

  const createNewProject = () => router.push("/app/projects/new");

  return (
    <SidebarShell sidebarItems={getProjectsSidebarItems(projects)}>
      <div className="w-full h-full p-4">
        <button
          className="flex flex-row items-center content-center space-x-2 p-2 rounded bg-indigo-600 text-gray-200"
          onClick={createNewProject}
        >
          <PlusIcon className="w-6 h-6" />
          <p className="text-sm">New Project</p>
        </button>
        <div className="flex flex-col space-y-6 mt-6">
          {/* {organizations.map(org => (
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
          ))} */}

          <div className="space-y-3">
            {profile?.username && (
              <h2 className="text-lg">{profile.username}</h2>
            )}
            <ul className="grid gap-4 mx-auto grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
              {projects.map(project => (
                <li key={project.id} className="col-span-1">
                  <a href={`/app/projects/${project.id}`}>
                    <ProjectCard project={project} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
};

export default ProjectsPage;
