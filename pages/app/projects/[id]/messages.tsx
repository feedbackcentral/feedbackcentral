import { Feedback, FeedbackSource, Language } from "@feedbackcentral/types";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/forms/Button";
import { Field } from "~/components/forms/Field";
import { SidebarShell } from "~/components/SidebarShell";
import { getSidebarItems } from "../_sidebarItems";

interface MessageCardProps {
  feedback: Feedback;
  isReplying: boolean;
  onReply: (id: number) => any;
}

const MessageCard = ({ feedback, onReply, isReplying }: MessageCardProps) => {
  const isPositive = feedback.relevance > 0.5;
  return (
    <div className="rounded-md h-full bg-light-100 shadow-md mt-5 p-5 w-3/10 relative <md:w-full">
      <header className="flex justify-between">
        <div className="flex gap-5 items-center">
          <Image src="/icons/twitter.svg" width={30} height={30} />
          <p>{feedback.author}</p>
        </div>
        <div className="flex items-center">
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
        </div>
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
  const [displayModal, setDisplayModal] = React.useState<number | false>(false);
  // TODO: Connect with Supabase to get real datas
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>([
    {
      id: 1,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      author: "John Doe",
      relevance: 0.8,
      source: FeedbackSource.TWITTER,
      language: Language.ENGLISH,
      createdAt: new Date("2020-01-01T00:00:00.000Z"),
    },
    {
      id: 2,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      author: "John Doe",
      relevance: 0.3,
      source: FeedbackSource.TWITTER,
      language: Language.ENGLISH,
      createdAt: new Date("2020-01-10T00:00:00.000Z"),
    },
    {
      id: 3,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      author: "John Doe",
      relevance: 0.6,
      source: FeedbackSource.TWITTER,
      language: Language.ENGLISH,
      createdAt: new Date("2020-01-12T00:00:00.000Z"),
    },
    {
      id: 4,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      author: "John Doe",
      relevance: 0.2,
      source: FeedbackSource.TWITTER,
      language: Language.ENGLISH,
      createdAt: new Date("2020-02-05T00:00:00.000Z"),
    },
  ]);

  const sortBy = (field: string) => {
    console.log({ field });
    switch (field) {
      case "default":
        feedbacks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case "relevance":
        feedbacks.sort((a, b) => b.relevance - a.relevance);
        break;
      default:
        break;
    }
    setFeedbacks([...feedbacks]);
  };

  return (
    <SidebarShell sidebarItems={getSidebarItems(router.query.id as string)}>
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
