const House = require("../models/house.model");
const User = require("../models/user.model");

/* Get All the Users From Admin Page */
exports.getAllUsersService = async (queries) => {
  try {
    const users = await User.find(queries)
      .skip(queries.skip)
      .limit(queries.limit);
    /* Get Total Numbers of Users */
    const totalUsers = await User.countDocuments();
    return { totalUsers, users };
  } catch (error) {
    console.log(error.message);
  }
};

/* Find Single user By ID */
exports.findByIdUserService = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.log(error.message);
  }
};

/* Get All total Users */
exports.getActiveUsersService = async () => {
  try {
    const totalUsers = await User.find({ role: "user", status: "active" });
    return totalUsers;
  } catch (error) {
    console.log(error.message);
  }
};

/* Find House by Slug */
exports.findHousesBySlugService = async (fields) => {
  try {
    if (fields.slug === "unapproved") {
      const houses = await House.find({ status: "pending" })
        .populate("owner", "name email")
        .skip(fields.skip)
        .limit(fields.limit);

      const count = await House.countDocuments({ status: "pending" });

      return { count, houses };
    }
    if (fields.slug === "approved") {
      const houses = await House.find({ status: "approved" })
        .populate("owner", "name email")
        .skip(fields.skip)
        .limit(fields.limit);

      const count = await House.countDocuments({ status: "approved" });
      return { count, houses };
    }
    if (fields.slug === "rejected") {
      const houses = await House.find({ status: "rejected" })
        .populate("owner", "name email")
        .skip(fields.skip)
        .limit(fields.limit);

      const count = await House.countDocuments({ status: "rejected" });
      return { count, houses };
    }
  } catch (error) {
    console.log(error.message);
  }
};
