const House = require("../models/house.model");

/* Views Count */
const ViewsCount = (req, res, next) => {
    const { id } = req.params;
    if (id) {
        House.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
            .then((house) => {
                if (!house) {
                    return res.status(404).json({
                        success: false,
                        message: "House not found",
                    });
                }
                next();
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    message: "Server Error",
                });
            });
    } else {
        next();
    }
};



module.exports = ViewsCount;