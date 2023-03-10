const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompositionSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Composition", CompositionSchema);
