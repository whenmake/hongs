// models/Completed.js
const mongoose = require("mongoose");

const completedSchema = new mongoose.Schema({
  index: { type: Number, required: true }, // 날짜 인덱스
  status: { type: Boolean, required: true }, // 완료 상태
  nickname: { type: String, required: true }, // 사용자 ID (선택적으로 추가)
});

module.exports = mongoose.model("Completed", completedSchema);
