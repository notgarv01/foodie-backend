const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood,
);

router.get("/",authMiddleware.authUserMiddleware, foodController.getFoodItem);

router.post('/like',authMiddleware.authUserMiddleware,foodController.likeFoodController)

router.post('/save',authMiddleware.authUserMiddleware,foodController.saveFoodController)

router.get('/save',authMiddleware.authUserMiddleware,foodController.getSavedFood)

module.exports = router;
