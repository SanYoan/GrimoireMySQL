const express = require("express");
const { connectToDatabase } = require("./config/database");
// Récupèration des models crée
const Book = require("./models/books");
const User = require("./models/users");
const Rating = require("./models/rating");

require("dotenv").config();

const path = require("path");
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");

const app = express();

//Connexion a la BDD au lancement du serveur
connectToDatabase();

app.use(express.json());

/* Liaison entre les tables */
User.hasMany(Book, { foreignKey: "userId" });
Book.belongsTo(User, { foreignKey: "userId" });
Book.hasMany(Rating, { foreignKey: "bookId", as: "ratings" });
Rating.belongsTo(Book, { foreignKey: "bookId" });
Rating.belongsTo(User, { foreignKey: "userId" });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
