const { Sequelize } = require("sequelize");
require("dotenv").config();

//Information de connexion a la BDD
const sequelize = new Sequelize("oldgrimoire", "root", process.env.MDP_MYSQL, {
  host: "localhost",
  dialect: "mysql",
});

//Fonction pour connexion a la BDD
const connectToDatabase = async () => {
  {
    try {
      await sequelize.authenticate();
      console.log("Connexion établie a la BDD");
      await sequelize.sync({});
      console.log("Tables synchronisées avec succès");
    } catch (error) {
      console.error("Connexion échoué");
    }
  }
};

//Export de sequelize et import dans APP pour connectToDatabase
module.exports = { sequelize, connectToDatabase };
