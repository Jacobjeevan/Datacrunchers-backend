const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const officerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  imageDest: {
    type: String,
    required: true,
  },
});

const Officer = mongoose.model("Officer", officerSchema);

module.exports = Officer;
