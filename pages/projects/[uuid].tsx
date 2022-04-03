import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import type { NextPage } from "next";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Positive", "Negatif"],
  datasets: [
    {
      label: "# of Votes",
      data: [15, 3],
      backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
      borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
      borderWidth: 1,
    },
  ],
};

const ChartElement = () => {
  return (
    <div className="flex w-100 h-100 justify-center items-center <md:(w-75 h-75)">
      <Doughnut width={"10px"} height={"10px"} data={data} />
    </div>
  );
};

const SummarizeCard = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className="bg-primary w-75 rounded-md p-5 shadow-md">
      <h2 className="subtitle font-semibold">{title}</h2>
      <p className="mt-5 text-xl">{content}</p>
    </div>
  );
};

const ProjectPage: NextPage = () => {
  const messages = [
    "It sucks hardieijzj eizj eojzejz ejzlkj elkzjelkzjelk jzlkje lzj elkzjelkjzlkej",
    "Looks awesome",
    "Hmm, need to have a better look",
  ];

  const feedbacks = messages;
  const features_launched = [];

  return (
    <section className="w-full">
      <h1 className="title">Overview</h1>
      <section className="mt-10 ml-10">
        <section className="flex gap-10">
          <SummarizeCard
            title="Total feedbacks"
            content={`${feedbacks.length}`}
          />
          <SummarizeCard
            title="Total features launched"
            content={`${features_launched.length}`}
          />
          <SummarizeCard
            title="Total features launched"
            content={`${features_launched.length}`}
          />
        </section>
        <section></section>
      </section>
    </section>
  );
};

// export async function getStaticProps() {
//   // Call an external API endpoint to get posts
//   const res = await fetch('https://.../posts');
//   const posts = await res.json();

//   // By returning { props: { posts } }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       data,
//     },
//   };
// }

export default ProjectPage;
