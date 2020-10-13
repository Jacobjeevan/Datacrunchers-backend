const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const careerSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Career = mongoose.model("Career", careerSchema);

module.exports = Career;
