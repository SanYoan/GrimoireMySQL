const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");


// Définir le chemin du dossier 'images' à la racine du projet backend
const imagesDir = path.resolve(__dirname, "..", "images");

// Vérifier si le dossier 'images' existe, sinon le créer
if (!fs.existsSync(imagesDir)) {
  try {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log("Dossier 'images' créé.");
  } catch (error) {
    console.error("Erreur lors de la création du dossier 'images':", error);
  }
}

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(`Destination de l'image: ${imagesDir}`); // Débogage
    callback(null, imagesDir);
  },
  filename: (req, file, callback) => {
    const name = file.originalname.slice(0, 3);
    const fileName = name + Date.now() + ".webp";
    console.log(`Nom du fichier: ${fileName}`); // Débogage
    callback(null, fileName);
  },
});

// Configuration du filtre pour les types MIME autorisés
const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
    console.log("Type de fichier non autorisé:", file.originalname); // Débogage
    return callback(
      new Error("Seuls les fichiers JPG, JPEG, PNG et WebP sont autorisés !"),
      false
    );
  }
  callback(null, true);
};

module.exports = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image"
);

module.exports.optimizeImage = (req, res, next) => {
  // On vérifie si un fichier a été téléchargé
  if (!req.file) {
    console.log("Aucun fichier téléchargé."); // Débogage
    return next();
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const outputFilePath = path.join(imagesDir, fileName);

  console.log(`Chemin de l'image originale: ${filePath}`); // Débogage
  console.log(`Chemin de l'image optimisée: ${outputFilePath}`); // Débogage

  // Désactivation du cache !!!
  sharp.cache(false);
  sharp(filePath)
    .resize({ height: 600 })
    .toFile(outputFilePath)
    .then(() => {
      console.log(`Image ${fileName} optimisée avec succès !`);
      // Remplacer le fichier original par le fichier optimisé
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la suppression de l'ancienne image:",
            err
          );
        } else {
          console.log(`Image ${fileName} supprimée avec succès !`);
        }
        req.file.path = outputFilePath;
        next();
      });
    })
    .catch((err) => {
      console.error("Erreur lors de l'optimisation de l'image:", err);
      return next();
    });
};
