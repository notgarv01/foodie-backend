const foodPartnerModel = require('../models/foodPartner.model')
const foodModel = require('../models/food.model')

async function getFoodPartnerById(req, res) {
    const foodPartnerId = req.params.id;

    try {
        const foodPartner = await foodPartnerModel.findById(foodPartnerId);
        
        // Agar partner nahi mila toh yahi se return kar jayein
        if (!foodPartner) {
            return res.status(404).json({
                message: "Food partner not found"
            });
        }

        // Partner ki videos fetch karein
        const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

        // Dono data ko ek saath bhejye
        res.status(200).json({
            message: "food partner found",
            foodPartner, // Partner details (name, address etc)
            foodItems: foodItemsByFoodPartner // Sari videos ka array
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = {getFoodPartnerById}