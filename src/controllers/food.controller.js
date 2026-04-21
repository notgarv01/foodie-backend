const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  // console.log(req.foodPartner);
  // console.log(req.body);
  // console.log(req.file);

  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid(),
  );
  // console.log(fileUploadResult);
  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id,
  });

  res.status(201).json({
    message: "food item created successfully",
    food: foodItem,
  });
}

async function getFoodItem(req, res) {
  const foodItems = await foodModel.find({});

  res.status(201).json({
    messgae: "Food items fetched successfully",
    foodItems,
  });
}

async function likeFoodController(req, res) {
  const { foodId } = req.body;
  const userId = req.user._id; // Isse pata chalta hai kaun like kar raha hai

  // Query mein userId aur foodId dono hona compulsory hai
  const isAlreadyLiked = await likeModel.findOne({ 
    user: userId, 
    food: foodId 
  });

  if (isAlreadyLiked) {
    // Agar user ne pehle like kiya tha, toh sirf uska like delete hoga
    await likeModel.deleteOne({ _id: isAlreadyLiked._id });

    const updatedFood = await foodModel.findByIdAndUpdate(
      foodId,
      { $inc: { likeCount: -1 } },
      { new: true }
    );

    return res.status(200).json({
      liked: false,
      likeCount: updatedFood.likeCount < 0 ? 0 : updatedFood.likeCount, // Safety check
    });
  }

  // Agar user pehli baar like kar raha hai
  await likeModel.create({ user: userId, food: foodId });

  const updatedFood = await foodModel.findByIdAndUpdate(
    foodId,
    { $inc: { likeCount: 1 } },
    { new: true }
  );

  res.status(201).json({
    liked: true,
    likeCount: updatedFood.likeCount,
  });
}

async function saveFoodController(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  const isAlreadySaved = await saveModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadySaved) {
    await saveModel.deleteOne({ _id: isAlreadySaved._id });
    return res.status(200).json({
      message: "Food unsaved successfully",
      isSaved: false, // Yeh frontend ke liye
    });
  }

  await saveModel.create({
    user: user._id,
    food: foodId,
  });

  res.status(201).json({
    message: "Food saved successfully",
    isSaved: true, // Yeh frontend ke liye
  });
}

async function getSavedFood(req, res) {
  const userId = req.user._id;

  const foods = await foodModel.find();

  const foodItems = await Promise.all(
    foods.map(async (item) => {
      const liked = await likeModel.findOne({
        user: userId,
        food: item._id,
      });

      const saved = await saveModel.findOne({
        user: userId,
        food: item._id,
      });

      return {
        ...item._doc,
        isLiked: !!liked,
        isSaved: !!saved,
      };
    })
  );

  res.status(200).json({
    foodItems,
  });
}

module.exports = {
  createFood,
  getFoodItem,
  likeFoodController,
  saveFoodController,
  getSavedFood,
};
