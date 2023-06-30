const mongoose = require("mongoose");
const { Schema } = mongoose;

const geniusCoinSchema = new Schema({
  price: { type: Schema.Types.Number },
  createdAt: { type: Schema.Types.Date, default: Date.now },
});

const geniusCoin = mongoose.model("geniusCoin", geniusCoinSchema);

module.exports = geniusCoin;
