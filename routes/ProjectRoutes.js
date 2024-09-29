const ProjectController = require("../controllers/Project/ProjectController");
const { ProjectValidationMiddleware } = require("../middlewares/Project/ProjectValidationMiddleware");
const { ProjectExistenceMiddleware } = require("../middlewares/Project/ProjectExistenceMiddleware");

module.exports = function (app) {
  app.get("/projects", ProjectController.index);
  app.post("/projects/download", ProjectController.download);
  app.post("/projects/download/multiple", ProjectController.downloadMultiple);
  app.post("/projects", ProjectValidationMiddleware, ProjectController.store);
  app.get("/projects/:Project", [ProjectValidationMiddleware, ProjectExistenceMiddleware], ProjectController.show);
  app.get("/projects/tag/:Tag", ProjectController.listByTag);
  app.get("/projects/:Repo/readme", ProjectController.getReadmeFile);
  app.put(
    "/projects/:Project/update",
    [ProjectValidationMiddleware, ProjectExistenceMiddleware],
    ProjectController.update
  );
  app.delete("/projects/:Project/delete", ProjectExistenceMiddleware, ProjectController.destroy);
};
