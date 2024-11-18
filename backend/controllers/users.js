const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/users");

exports.signup = (req, res, next) => {
  const emailRegex = /\S+@\S+\.\S+/; // Regex pour vérifier un format d'email de base

  // Vérifier si l'email est valide
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ message: "Email invalide." });
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      return user.save();
    })
    .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user === null) {
        return res
          .status(403)
          .json({ message: "Paire identifiant/mot de passe incorrecte" });
      } else {
        return bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(403)
                .json({ message: "Paire identifiant/mot de passe incorrecte" });
            } else {
              const token = jwt.sign(
                { userId: user.id },
                process.env.KEY_SECRET,
                { expiresIn: "24h" }
              );
              return res.status(200).json({
                userId: user.id,
                token: token,
              });
            }
          });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
