// import { withAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";
import { Feedback, FeedbackSource, Language } from "@feedbackcentral/types";
import { withAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { capitalize, groupBy } from "lodash";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Line } from "react-chartjs-2";
import { SidebarShell } from "~/components/SidebarShell";
import { getSidebarItems } from "../_sidebarItems";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  LineElement,
  CategoryScale,
  PointElement,
  Filler
);

interface EvolutionChartProps {
  feedbacks: Feedback[];
}

interface StatsCardProps {
  title: string;
  amounts: number[];
  fields: string[];
  datas: number[];
}

const EvolutionChart = ({ feedbacks }: EvolutionChartProps) => {
  const feedbacksSorted = feedbacks.sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
  const feedbacksByMonths = groupBy(feedbacksSorted, feedback =>
    feedback.createdAt.getMonth()
  );

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Feedbacks amount",
        data: Object.keys(feedbacksByMonths).map(
          month => feedbacksByMonths[month].length
        ),
        fill: true,
        backgroundColor: ["rgba(165, 180, 252, 1)"],
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex flex-col justify-center shadow-md bg-light-100 px-10 pt-10 pb-20 relative h-100 rounded-md">
      <div className="mt-10">
        <h3 className="text-small">Feedbacks</h3>
        <h1 className="text-4xl font-bold mt-2">{feedbacks.length}</h1>
      </div>
      <Line
        width="10px"
        height="10px"
        // @ts-ignore
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          // @ts-ignore
          scale: {
            ticks: {
              precision: 0,
            },
          },
        }}
      />
    </div>
  );
};

const StatsCard = ({ title, amounts, fields, datas }: StatsCardProps) => {
  return (
    <div className="shadow-md rounded-md bg-light-100 w-100 p-10">
      <h1 className="text-bold text-2xl">{title}</h1>
      {fields.map((field, index) => {
        return (
          <div key={index} className="flex flex-col gap-2 mt-5">
            <div className="flex justify-between items-center">
              <p>{capitalize(field)}</p>
              <div className="flex items-center gap-5">
                <p className="font-bold">{amounts[index]}</p>
                <p>({datas[index]} %)</p>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-md overflow-hidden">
              <div
                className="bg-indigo-300 h-full"
                style={{ width: datas[index] + "%" }}
                id="progress-bar"
              ></div>
            </div>
            {/* <progress value={datas[index]} max="100" className="rounded-md">
              {datas[index]} %
            </progress> */}
          </div>
        );
      })}
    </div>
  );
};

const ProjectPage: NextPage = () => {
  const router = useRouter();

  // TODO: Connect with Supabase to get real datas
  const feedbacks: Feedback[] = [
    {
      id: 1,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      author: "John Doe",
      relevance: 0.1,
      source: FeedbackSource.TWITTER,
      language: Language.ENGLISH,
      createdAt: new Date("2020-01-01T00:00:00.000Z"),
    },
    {
      id: 2,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      author: "John Doe",
      relevance: 0.2,
      source: FeedbackSource.TWITTER,
      language: Language.ENGLISH,
      createdAt: new Date("2020-01-10T00:00:00.000Z"),
    },
    {
      id: 3,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      author: "John Doe",
      relevance: 0.4,
      source: FeedbackSource.TWITTER,
      language: Language.ENGLISH,
      createdAt: new Date("2020-01-12T00:00:00.000Z"),
    },
    {
      id: 4,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      author: "John Doe",
      relevance: 0.7,
      source: FeedbackSource.TWITTER,
      language: Language.ENGLISH,
      createdAt: new Date("2020-02-05T00:00:00.000Z"),
    },
  ];

  const groupedByLanguage = groupBy(feedbacks, feedback => feedback.language);
  const groupedByRelevance = groupBy(feedbacks, feedback => {
    if (feedback.relevance > 0.5) {
      return "positive";
    }
    return "negative";
  });

  return (
    <SidebarShell sidebarItems={getSidebarItems(router.query.id as string)}>
      <section className="w-full h-full p-10">
        <h1 className="title">Overview</h1>
        <section className="mt-10">
          <EvolutionChart feedbacks={feedbacks} />

          <div className="mt-10 flex flex-wrap gap-10">
            <StatsCard
              title="Languages"
              amounts={Object.keys(groupedByLanguage).map(
                v => groupedByLanguage[v].length
              )}
              fields={Object.keys(groupedByLanguage)}
              datas={Object.keys(groupedByLanguage).map(
                language =>
                  (100 * groupedByLanguage[language].length) / feedbacks.length
              )}
            />
            <StatsCard
              title="Relevance"
              amounts={Object.keys(groupedByRelevance).map(
                v => groupedByRelevance[v].length
              )}
              fields={Object.keys(groupedByRelevance)}
              datas={Object.keys(groupedByRelevance).map(
                language =>
                  (100 * groupedByRelevance[language].length) / feedbacks.length
              )}
            />
          </div>
        </section>
      </section>
    </SidebarShell>
  );
};

export const getServerSideProps = withAuthRequired({
  redirectTo: "/auth/login",
});

export default ProjectPage;
