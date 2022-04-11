import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Button } from "~/components/forms/Button";
import { Field } from "~/components/forms/Field";
import { Project, ProjectTier } from "~/lib/types";

const NewProjectPage: NextPage = () => {
  const { user } = useUser();
  const [projectName, setProjectName] = useState("");
  const router = useRouter();

  const createNewProject = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    supabaseClient
      .from<Project>("projects")
      .insert({
        name: projectName,
        owner_id: user.id,
        tier: ProjectTier.FREE,
      })
      .single()
      .then(({ data: project }) => {
        if (!project) return;
        router.push(`/app/projects/${project.id}`);
      });
  };

  return (
    <div className="w-full h-full p-4 flex justify-center md:items-center <md:mt-20">
      <form onSubmit={createNewProject} className="w-1/3 <md:w-2/3">
        <Field
          name="Project name"
          value={projectName}
          placeholder={`e.g. My First project`}
          onChange={setProjectName}
        />
        <div className="flex gap-10">
          <Button
            className="w-1/3 bg-red-300 mt-5 h-10 rounded-md"
            onClick={() => router.push("/app")}
          >
            Cancel
          </Button>
          <Button
            className="w-2/3 bg-primary mt-5 h-10 rounded-md"
            type="submit"
          >
            Create new project
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectPage;
