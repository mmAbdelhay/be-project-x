const ProjectRepository = require("../../repositories/ProjectRepository");
const EnvironmentRepository = require("../../repositories/EnvironmentRepository");
const gitHubService = require("../../services/githubService");

module.exports.index = async (req, res) => {
  return res.status(200).json({ data: await ProjectRepository.findBy({ userId: req.authUser._id }) });
};

module.exports.show = async (req, res) => {
  if (req.params.Project.userId !== req.authUser._id) return res.status(403).json({ message: "Project not yours" });

  return res.status(200).json({ data: req.params.Project });
};

module.exports.store = async (req, res) => {
  const Environment = await EnvironmentRepository.findBy({ id: req.body.validated.environmentId });
  if (!Environment) return res.status(403).json({ message: "Environment doesn't exists" });

  if (!gitHubService.createRepository(req.body.validated.name, "new repo using automation", false))
    return res.status(500).json({ message: "Project not created" });

  const data = await ProjectRepository.insert({ ...req.body.validated, userId: req.authUser._id });
  return res.status(201).json({ message: "Project created Successfully", data: data });
};

module.exports.update = async (req, res) => {
  if (req.params.Project.userId !== req.authUser._id) return res.status(403).json({ message: "Project not yours" });

  const data = await ProjectRepository.update(req.params.Project, req.body.validated);
  return res.status(200).json({ message: "Project updated Successfully", data: data });
};

module.exports.destroy = async (req, res) => {
  if (req.params.Project.userId !== req.authUser._id) {
    return res.status(403).json({ message: "Project not yours" });
  }

  if (!gitHubService.deleteRepo(req.params.Project.name))
    return res.status(500).json({ message: "Project not deleted" });

  await ProjectRepository.destroy(req.params.Project.id);
  return res.status(200).json({ message: "Project deleted Successfully" });
};
