import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "~/components/forms/Button";
import { Field } from "~/components/forms/Field";
import { SidebarShell } from "~/components/SidebarShell";
import { getProjectSidebarItems } from "~/lib/sidebarItems";
import { Project, Source } from "~/lib/types";

const MessagesPage: NextPage = () => {
  const router = useRouter();
  const [projectName, setProjectName] = React.useState("");
  const [twitterName, setTwitterName] = React.useState("");
  const projectId = router.query.id as string;

  const integrations = {
    twitter: false,
  };

  useEffect(() => {
    if (!projectId) return;
    supabaseClient
      .from<Project>("projects")
      .select("*")
      .eq("id", projectId)
      .single()
      .then(({ data: project }) => {
        if (!project) return;
        setProjectName(project.name);
      });
  }, [projectId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submit");
    supabaseClient.from<Project>("projects").update({ name: projectName });
    supabaseClient.from<Source>("sources").insert({
      type: "twitter_mention",
      parameters: {
        username: twitterName,
      },
      project_id: projectId,
    });
    toast.success("Saved", {
      position: "top-right",
    });
  };

  return (
    <SidebarShell sidebarItems={getProjectSidebarItems(projectId)}>
      <section className="h-full w-full p-10">
        <h1 className="title">Settings</h1>
        <section className="flex flex-wrap mt-10 gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <Field
              name="Project name"
              value={projectName}
              onChange={value => setProjectName(value)}
            />
            <Field
              name="Twitter name"
              value={twitterName}
              onChange={value => setTwitterName(value)}
            />
            <Button className="rounded-md bg-green-300 p-2 w-20" type="submit">
              Save
            </Button>
            {/* TODO: Have a better look how integrate this */}
            {/* <div className="flex mt-5 gap-2 items-center">
              <Button className="rounded-md flex bg-blue-500 h-10 p-2 w-10 justify-center items-center">
                <Image src="/icons/twitter_white.svg" width={40} height={40} />
              </Button>
              <p>{integrations.twitter ? "Logged" : "Not logged"}</p>
            </div> */}
          </form>
        </section>
      </section>
    </SidebarShell>
  );
};

export default MessagesPage;
