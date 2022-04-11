import { Project, ProjectTier } from "@feedbackcentral/types";
import { ChevronRightIcon } from "@heroicons/react/outline";

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div
      className={
        "bg-light-100 rounded px-2 py-4 space-y-2 border border-2 shadow-md hover:bg-accent " +
        (project.tier == ProjectTier.FREE &&
          "border-green-200 hover:border-green-400")
      }
    >
      <div>
        <div className="flex flex-row justify-between w-full">
          <p className="text-gray-800">{project.name}</p>
          <ChevronRightIcon className="w-9 h-6 text-gray-400" />
        </div>
        <div>
          {/* <p className="text-sm text-gray-500">{project.description}</p> */}
        </div>
      </div>
    </div>
  );
};
