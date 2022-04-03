const ProjectsPage = () => {
  const projects = [
    {
      uuid: "123",
      name: "Project 1",
      description: "This is a project",
      createdAt: "2020-01-01",
      updatedAt: "2020-01-01",
      organization: "Organization 1",
    },
  ];

  return (
    <section className="w-full">
      <h1 className="title">Projects</h1>
    </section>
  );
};

export default ProjectsPage;
