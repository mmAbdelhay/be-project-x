const Validator = require("validatorjs");

module.exports.EnvironmentValidationMiddleware = async (req, res, next) => {
    const rules = require(`../../controllers/Environment/${req.method === 'POST' ? 'create' : 'update'}EnvironmentRules`)
    const validation = new Validator(req.body, rules);
    if (validation.fails()) return res.status(422).json({errors: validation.errors.all()});

    req.body.validated = validation.input;
    next();
};