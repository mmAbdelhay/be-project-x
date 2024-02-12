const ProjectRepository = require("../../repositories/ProjectRepository");

module.exports.ProjectExistenceMiddleware = async (req, res, next) => {
    if (!req.params.Project) return res.status(404).json({message: "Not found"});

    const item = await ProjectRepository.findOneBy({id: req.params.Project});
    if (!item) return res.status(404).json({message: "Not found"});

    req.params.Project = item

    next();
};