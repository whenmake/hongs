const express = require("express");
const router = express.Router();
const User = require("../models/User"); // 사용자 모델

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

module.exports = router;