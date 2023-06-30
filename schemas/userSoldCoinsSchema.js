const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSoldCoinsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  price: { type: Schema.Types.Number },
  createdAt: { type: Schema.Types.Date, default: Date.now },
});

const userSoldCoins = mongoose.model("userSoldCoins", userSoldCoinsSchema);

module.exports = userSoldCoins;
