const EnvironmentRepository = require("../../repositories/EnvironmentRepository");

module.exports.index = async (req, res) => {
    return res.status(200).json({data: await EnvironmentRepository.findAll()});
};

module.exports.show = async (req, res) => {
    return res.status(200).json({data: req.params.Environment});
};

module.exports.store = async (req, res) => {
    const data = await EnvironmentRepository.insert(req.body.validated);
    return res.status(201).json({message: "Environment created Successfully", data: data});
};

module.exports.update = async (req, res) => {
    const data = await EnvironmentRepository.update(req.params.Environment, req.body.validated);
    return res.status(200).json({message: "Environment updated Successfully", data: data});
};

module.exports.destroy = async (req, res) => {
    await EnvironmentRepository.destroy(req.params.Environment.id);
    return res.status(200).json({message: "Environment deleted Successfully"});
};