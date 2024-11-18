const Book = require("../models/books");
const Rating = require("../models/rating");
const fs = require("fs");

exports.createBook = async (req, res, next) => {
  try {
    // Parse le corps de la requête pour obtenir les informations du livre
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;

    // Crée un nouvel objet Book
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId, // Associe l'ID de l'utilisateur authentifié
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`, // URL de l'image
    });

    // Sauvegarde le livre dans la base de données
    await book.save();

    // Si une note est fournie dans la requête, crée un objet Rating
    if (bookObject.ratings) {
      for (const ratingData of bookObject.ratings) {
        const rating = new Rating({
          userId: ratingData.userId, // Associe l'ID de l'utilisateur
          bookId: book._id, // Associe l'ID du livre nouvellement créé
          grade: ratingData.grade, // Utilise la note fournie dans la requête
        });

        // Sauvegarde la note dans la base de données
        await rating.save();
      }
    }

    // Répond avec le livre créé et éventuellement la note
    res.status(201).json({ message: "Book created successfully!", book });
  } catch (error) {
    // Gère les erreurs
    res.status(400).json({ error: error.message });
  }
};

exports.modifyBook = async (req, res, next) => {
  try {
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    delete bookObject.userId;

    const book = await Book.findOne({
      where: { _id: req.params.id },
      include: [{ model: Rating, as: "ratings" }],
    });

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    if (req.file) {
      const oldFilename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${oldFilename}`, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la suppression de l'ancienne image:",
            err
          );
        }
      });
    }

    await book.update({ ...bookObject });
    res.status(200).json({ message: "Livre modifié avec succès" });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Erreur lors de la modification du livre",
    });
  }
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({
    where: { _id: req.params.id },
    include: [{ model: Rating, as: "ratings" }],
  })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.destroy({
            where: { _id: req.params.id },
            include: [{ model: Rating, as: "ratings" }],
          })
            .then(() => res.status(204).json())
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    where: { _id: req.params.id },
    include: [{ model: Rating, as: "ratings" }],
  })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Aucun livre trouvé." });
      }
      res.status(200).json(book);
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllBook = (req, res, next) => {
  Book.findAll({ include: [{ model: Rating, as: "ratings" }] })
    .then((books) => {
      if (!books) {
        return res.status(404).json({ message: "Aucun livre trouvé." });
      }
      res.status(200).json(books);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des livres." });
    });
};

exports.getBestBook = (req, res, next) => {
  Book.findAll({
    order: [["averageRating", "DESC"]],
    limit: 3,
  })
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.ratingBook = async (req, res, next) => {
  const userId = req.body.userId;
  const rating = req.body.rating;

  // Validation des entrées
  if (!userId) {
    return res.status(400).json({ message: "ID utilisateur requis" });
  }
  if (rating < 0 || rating > 5) {
    return res.status(400).json({ error: "La note doit être entre 0 et 5" });
  }

  try {
    // Trouver le livre
    const book = await Book.findOne({
      where: { _id: req.params.id },
      include: [{ model: Rating, as: "ratings" }],
    });

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Chercher la note de l'utilisateur
    const userRating = await Rating.findOne({
      where: { userId: userId, bookId: book._id },
    });

    if (userRating) {
      // Si l'utilisateur a déjà noté, on met à jour sa note
      await userRating.update({ grade: rating });
    } else {
      // Sinon, on crée une nouvelle note
      await Rating.create({ userId: userId, bookId: book._id, grade: rating });
    }

    // Recalculer la note moyenne
    const ratings = await Rating.findAll({ where: { bookId: book._id } });
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum, r) => sum + r.grade, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Mettre à jour la note moyenne du livre
    await book.update({ averageRating });

    const updatedBook = book.toJSON(); // Utilisation de toJSON pour éviter de manipuler directement dataValues
    updatedBook.ratings = ratings.map((rating) => rating.toJSON());

    // Répondre avec le livre mis à jour
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Erreur lors de la notation du livre:", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la notation du livre" });
  }
};
