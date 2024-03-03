const User = require('../models/User');

exports.recordExpense = async (req, res, next) => {
    const amount = parseFloat(req.body.amount); // Correctly parse the amount as a float

    try {
        // Retrieve the user document from the database
        const user = await User.findById(req.user.id);
        
        if (!user) {
            console.log(user);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update the user's totalExpenses field
        user.totalExpenses = (user.totalExpenses || 0) + amount;


        // Respond with a success message and the updated totalExpenses
        res.status(200).json({
            success: true,
            message: "Total payment recorded successfully",
            totalExpenses: user.totalExpenses,
        });
    } catch (error) {
        console.error('Error recording expense:', error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};