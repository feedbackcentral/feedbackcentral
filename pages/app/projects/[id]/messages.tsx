import { Feedback } from "@feedbackcentral/types";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Button } from "~/components/forms/Button";
import { Field } from "~/components/forms/Field";
import { SidebarShell } from "~/components/SidebarShell";
import { getProjectSidebarItems } from "~/lib/sidebarItems";

interface MessageCardProps {
  feedback: Feedback;
  isReplying: boolean;
  onReply: (id: string) => any;
}

const MessageCard = ({ feedback, onReply, isReplying }: MessageCardProps) => {
  // const isPositive = feedback.relevance > 0.5;
  return (
    <div className="rounded-md h-full bg-light-100 shadow-md mt-5 p-5 w-3/10 relative <md:w-full">
      <header className="flex justify-between">
        <div className="flex gap-5 items-center">
          <Image src="/icons/twitter.svg" width={30} height={30} />
          {/* <p>{feedback.author}</p> */}
        </div>
        {/* <div className="flex items-center">
          <div className={isPositive ? "" : "rotate-x-180 transform"}>
            <Image
              src={
                feedback.relevance > 0.5
                  ? "/icons/green_triangle.png"
                  : "/icons/red_triangle.png"
              }
              width={20}
              height={20}
            />
          </div>
        </div> */}
      </header>
      <p className="mt-5">{feedback.content}</p>
      <footer className="flex mt-5 justify-end items-center">
        {/* TODO: Uncomment it when MVP is finished */}
        {/* <Button
          className={
            "bg-indigo-300 px-5 py-2 rounded-md " + (isReplying ? "hidden" : "")
          }
          onClick={() => onReply(feedback.id)}
        >
          Reply
        </Button> */}
        <form
          className={
            "w-full h-50 flex flex-col p-2 gap-5 bg-light-100 " +
            (isReplying ? "" : "hidden")
          }
        >
          <Field
            name="content"
            inputType="textarea"
            placeholder="Thank you for your response ...."
          />
          <Button className="rounded-md bg-indigo-300 py-2 px-5">Reply</Button>
        </form>
      </footer>
    </div>
  );
};

const MessagesPage: NextPage = () => {
  const router = useRouter();
  const [displayModal, setDisplayModal] = React.useState<string | false>(false);
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>([]);
  const projectId = router.query.id as string;

  useEffect(() => {
    supabaseClient
      .from<Feedback>("feedbacks")
      .select("*")
      .eq("project_id", projectId)
      .then(({ data: feedbacks }) => {
        if (!feedbacks) return;
        setFeedbacks(feedbacks);
      });
  }, []);

  const sortBy = (field: string) => {
    console.log({ field });
    switch (field) {
      case "default":
        feedbacks.sort(
          (a, b) => a.created_at.getTime() - b.created_at.getTime()
        );
        break;
      // case "relevance":
      //   feedbacks.sort((a, b) => b.relevance - a.relevance);
      //   break;
      default:
        break;
    }
    setFeedbacks([...feedbacks]);
  };

  return (
    <SidebarShell sidebarItems={getProjectSidebarItems(projectId)}>
      <section className="h-full w-full p-10">
        <h1 className="title">Messages</h1>
        <section className="mt-10">
          {/* TODO: Add filters and sortBy */}
          {/* <nav>
            <select onChange={e => sortBy(e.target.value)}>
              <option value="default">Sort by</option>
              <option value="relevance">Relevance</option>
            </select>
          </nav> */}

          <div className="flex flex-wrap gap-5 mt-10">
            {feedbacks.map(feedback => (
              <MessageCard
                feedback={feedback}
                isReplying={displayModal === feedback.id || false}
                key={feedback.id}
                onReply={id => setDisplayModal(id)}
              />
            ))}
          </div>
        </section>
      </section>
    </SidebarShell>
  );
};

export default MessagesPage;
