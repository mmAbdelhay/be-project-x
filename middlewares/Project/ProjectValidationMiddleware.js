const Validator = require("validatorjs");

module.exports.ProjectValidationMiddleware = async (req, res, next) => {
    const rules = require(`../../controllers/Project/${req.method === 'POST' ? 'create' : 'update'}ProjectRules`)
    const validation = new Validator(req.body, rules);
    if (validation.fails()) return res.status(422).json({errors: validation.errors.all()});

    req.body.validated = validation.input;
    next();
};