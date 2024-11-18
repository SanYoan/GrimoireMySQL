const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("../middleware/multer-config");
const sharpMiddleware = require("../middleware/multer-config").optimizeImage;

const bookCtrl = require("../controllers/books");

router.get("/", bookCtrl.getAllBook);
router.get("/bestrating", bookCtrl.getBestBook);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, multer, sharpMiddleware, bookCtrl.createBook);
router.put("/:id", auth, multer, sharpMiddleware, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.ratingBook);

module.exports = router;
