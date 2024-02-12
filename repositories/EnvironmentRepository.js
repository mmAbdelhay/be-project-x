const db = require("../database/models/index");
const logger = require("../services/logger");

module.exports.insert = async (data) => {
    try {
        return await db.Environment.create(data);
    } catch (err) {
        logger.error("Database Insertion failed err: ", err);
        return false;
    }
};

module.exports.findBy = async (where, attributes = null) => {
    try {
        const dataRetrieved = await db.Environment.findAll({
            where: where,
            attributes: attributes,
        });
        return dataRetrieved ?? false;
    } catch (err) {
        logger.error("Database Selection failed err: ", err);
        return false;
    }
};

 module.exports.update = async (Environment, updatedData) => {
   try {
     return await Environment.update(updatedData)
   } catch (err) {
      logger.error("Database update client info failed err: ", err);
      return false;
   }
};

module.exports.destroy = async (item_id) => {
   try {
      return await db.Environment.destroy({
            where: {
               id: item_id,
            },
            individualHooks: true,
      });
   } catch (err) {
      logger.error("Database item Destruction failed err: ", err);
      return false;
   }
};

module.exports.findAll = async () => {
   try {
      return await db.Environment.findAll();
   } catch (err) {
      logger.error("Database selection failed err: ", err);
      return false;
   }
};