const EnvironmentRepository = require("../../repositories/EnvironmentRepository");

module.exports.EnvironmentExistenceMiddleware = async (req, res, next) => {
    if (!req.params.Environment) return res.status(404).json({message: "Not found"});

    const item = await EnvironmentRepository.findBy({id: req.params.Environment});
    if (!item) return res.status(404).json({message: "Not found"});

    req.params.Environment = item

    next();
};