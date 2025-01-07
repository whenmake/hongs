const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 닉네임 중복 확인 API
router.post("/check-nickname-duplicate", async (req, res) => {
  const { nickname } = req.body;

  if (!nickname) {
    return res.status(400).json({ message: "닉네임이 필요합니다." });
  }

  try {
    const existingUser = await User.findOne({ nickname });
    res.json({ available: !existingUser }); // 중복 여부 반환
  } catch (error) {
    console.error("닉네임 중복 확인 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 닉네임 확인 API
router.get("/check-nickname", async (req, res) => {
  const { uid } = req.query; // 클라이언트에서 전달된 UID

  if (!uid) {
    return res.status(400).json({ message: "UID가 필요합니다." });
  }

  try {
    const user = await User.findOne({ uid }); // UID로 사용자 검색
    if (user) {
      return res.status(200).json({ nickname: user.nickname });
    } else {
      return res.status(404).json({ message: "닉네임 없음" });
    }
  } catch (error) {
    console.error("닉네임 확인 실패:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});
// 닉네임 저장 API
router.post("/signup", async (req, res) => {
  const { uid, nickname } = req.body;

  if (!uid || !nickname) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { nickname },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "닉네임 저장 완료", user });
  } catch (error) {
    console.error("닉네임 저장 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
