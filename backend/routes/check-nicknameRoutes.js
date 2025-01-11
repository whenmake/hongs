const express = require("express");
const router = express.Router();
const User = require("../models/User"); // User 모델 가져오기

// /api/check-nickname
router.get("/", async (req, res) => {
  const { uid } = req.query;
  if (!uid) {
    return res.status(400).json({ message: "UID 파라미터가 필요합니다." });
  }

  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ hasNickname: false });
    }
    console.error("uid, 닉네임:", uid, user.nickname);
    res.status(200).json({ hasNickname: true, nickname: user.nickname });
  } catch (error) {
    console.error("닉네임 확인 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});


module.exports = router;