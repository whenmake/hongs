// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   nickname: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
// });

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase에서 제공된 UID
  nickname: { type: String, required: true, unique: true }, // 유저가 생성한 닉네임
});

module.exports = mongoose.model("User", userSchema);
