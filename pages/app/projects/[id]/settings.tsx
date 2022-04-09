import { withAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/forms/Button";
import { Field } from "~/components/forms/Field";
import { SidebarShell } from "~/components/SidebarShell";
import { getProjectSidebarItems } from "~/lib/sidebarItems";

const MessagesPage: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.id as string;

  const integrations = {
    twitter: false,
  };

  // TODO: Connect with Supabase to get real datas
  const [projectName, setProjectName] = React.useState("Hello world");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Connect with Supabase to get real datas
  };

  return (
    <SidebarShell
      sidebarItems={getProjectSidebarItems(router.query.id as string)}
    >
      <section className="h-full w-full p-10">
        <h1 className="title">Settings</h1>
        <section className="flex flex-wrap mt-10 gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <Field
              name="project name"
              value={projectName}
              onChange={value => setProjectName(value)}
            />
            <Button className="rounded-md bg-green-300 p-2 w-20">Save</Button>
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

export const getServerSideProps = withAuthRequired({
  redirectTo: "/auth/login",
});

export default MessagesPage;
