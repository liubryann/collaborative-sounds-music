const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  compositions: [{ type: Schema.Types.ObjectId, ref: "Composition" }],
});

User.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

module.exports = mongoose.model("User", UserSchema);
