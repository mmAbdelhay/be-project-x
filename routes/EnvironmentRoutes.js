const EnvironmentController = require('../controllers/Environment/EnvironmentController');
const {EnvironmentValidationMiddleware} = require("../middlewares/Environment/EnvironmentValidationMiddleware");
const {EnvironmentExistenceMiddleware} = require("../middlewares/Environment/EnvironmentExistenceMiddleware");

module.exports = function (app) {
    app.get("/environments", EnvironmentController.index);
    app.post("/environments", EnvironmentValidationMiddleware, EnvironmentController.store);
    app.get("/environments/:Environment",[EnvironmentValidationMiddleware, EnvironmentExistenceMiddleware] , EnvironmentController.show);
    app.put("/environments/:Environment/update",[EnvironmentValidationMiddleware, EnvironmentExistenceMiddleware] , EnvironmentController.update);
    app.delete("/environments/:Environment/delete",EnvironmentExistenceMiddleware, EnvironmentController.destroy);
};