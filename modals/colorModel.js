const mongoose = require("mongoose");
const colorNature = require("../utils/findColorNature");

const colorSchema = new mongoose.Schema(
  {
    colorValue: {
      type: String,
      required: true,
      unique: true,
    },
    colorName: {
      type: String,
    },
    isDark: {
      type: Boolean,
    },
    isVibrant: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
colorSchema.pre("save", async function (next) {
  try {
    const colorDetails = colorNature(this.colorValue);
    this.colorName = colorDetails.name;
    this.isDark = colorDetails.isDark;
    this.isVibrant = colorDetails.isVibrant;
    next();
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = mongoose.model("Color", colorSchema);
