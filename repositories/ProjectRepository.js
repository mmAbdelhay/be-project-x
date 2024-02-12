const db = require("../database/models/index");
const logger = require("../services/logger");

module.exports.insert = async (data) => {
    try {
        return await db.Project.create(data);
    } catch (err) {
        logger.error("Database Insertion failed err: ", err);
        return false;
    }
};

module.exports.findBy = async (where, attributes = null) => {
    try {
        const dataRetrieved = await db.Project.findAll({
            where: where,
            include: db.Environment
        });
        return dataRetrieved ?? false;
    } catch (err) {
        logger.error("Database Selection failed err: ", err);
        return false;
    }
};



module.exports.findOneBy = async (where) => {
    try {
        const dataRetrieved = await db.Project.findOne({
            where: where,
        });
        return dataRetrieved ?? false;
    } catch (err) {
        logger.error("Database Selection failed err: ", err);
        return false;
    }
};

 module.exports.update = async (Project, updatedData) => {
   try {
     return await Project.update(updatedData)
   } catch (err) {
      logger.error("Database update client info failed err: ", err);
      return false;
   }
};

module.exports.destroy = async (item_id) => {
   try {
      return await db.Project.destroy({
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
      return await db.Project.findAll();
   } catch (err) {
      logger.error("Database selection failed err: ", err);
      return false;
   }
};