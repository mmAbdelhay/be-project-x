const ProjectRepository = require("../../repositories/ProjectRepository");
const EnvironmentRepository = require("../../repositories/EnvironmentRepository");
const gitHubService = require("../../services/githubService");
const activityService = require("../../services/activityService");
const fs = require("fs");

module.exports.index = async (req, res) => {
  return res.status(200).json({ data: await gitHubService.listRepos() });
};

module.exports.show = async (req, res) => {
  if (req.params.Project.userId !== req.authUser._id) return res.status(403).json({ message: "Project not yours" });

  return res.status(200).json({ data: req.params.Project });
};

module.exports.store = async (req, res) => {
  const Environment = await EnvironmentRepository.findBy({ id: req.body.validated.environmentId });
  if (!Environment) return res.status(403).json({ message: "Environment doesn't exists" });

  if (!(await gitHubService.createRepository(req.body.validated.name, "new repo using automation", false)))
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

  if (!(await gitHubService.deleteRepo(req.params.Project.name)))
    return res.status(500).json({ message: "Project not deleted" });

  await ProjectRepository.destroy(req.params.Project.id);
  return res.status(200).json({ message: "Project deleted Successfully" });
};

module.exports.download = async (req, res) => {
  try {
    const { projectName } = req.body;

    if (!projectName || !(await gitHubService.getRepo(projectName))) {
      return res.status(403).json({ message: "Project does not exist" });
    }

    const filePath = await gitHubService.downloadRepoAsZip(projectName);

    if (!filePath) return res.status(500).json({ message: "Failed to download the repository" });

    res.download(filePath, `${projectName}.zip`, (err) => {
      if (err) {
        console.error(`Failed to send the ZIP file: ${err.message}`);
        res.status(500).json({ message: "Failed to download the file" });
      } else {
        console.log(`File sent: ${filePath}`);

        (async () => {
          await activityService.activity(
            "Project",
            "Download",
            null,
            `Downloaded ${projectName} project`,
            req.authUser._id
          );
        })();

        fs.unlink(filePath, (deleteErr) => {
          if (deleteErr) {
            console.error(`Failed to delete the file: ${deleteErr.message}`);
          } else {
            console.log(`File deleted: ${filePath}`);
          }
        });
      }
    });
  } catch (error) {
    console.error(`Error in download controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.downloadMultiple = async (req, res) => {
  try {
    const { projectNames } = req.body;

    if (!projectNames || projectNames.length === 0) {
      return res.status(400).json({ message: "No projects specified" });
    }

    // Download and zip the repositories
    const filePath = await gitHubService.downloadMultipleReposAsZip(projectNames);

    if (!filePath) {
      return res.status(500).json({ message: "Failed to zip the repositories" });
    }

    // Set headers to indicate a file download
    res.setHeader("Content-Disposition", "attachment; filename=repositories.zip");
    res.setHeader("Content-Type", "application/zip");

    // Stream the file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      (async () => {
        await activityService.activity(
          "Project",
          "Download multiple",
          null,
          `Downloaded ${projectNames.join(",")} projects`,
          req.authUser._id
        );
      })();

      // Delete the file after sending
      fs.unlink(filePath, (deleteErr) => {
        if (deleteErr) {
          console.error(`Failed to delete the file: ${deleteErr.message}`);
        } else {
          console.log(`File deleted: ${filePath}`);
        }
      });
    });

    fileStream.on("error", (err) => {
      console.error(`Stream error: ${err.message}`);
      res.status(500).json({ message: "Failed to download the file" });
    });
  } catch (error) {
    console.error(`Error in download controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.listByTag = async (req, res) => {
  return res.status(200).json({ data: await gitHubService.listReposByTag(req.params.Tag) });
};

module.exports.getReadmeFile = async (req, res) => {
  return res.status(200).json({ data: await gitHubService.getReadmeFile(req.params.Repo) });
};
