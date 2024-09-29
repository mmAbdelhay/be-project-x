const db = require("../database/models/index");

module.exports.activity = async function (modelName, action, data, description, causerId) {
  await db.AuditLog.create({ modelName, action, data, description, causerId });
};
