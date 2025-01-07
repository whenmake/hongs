
// 이메일 존재 여부 확인 API
router.post("/check", async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        return res.json({ exists: true, nickname: user.nickname });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error("DB 확인 실패:", error);
      res.status(500).send("서버 에러");
    }
  });
  
  // 회원가입 API
  router.post("/signup", async (req, res) => {
    const { nickname, email } = req.body;
  
    // 요청 데이터 출력
    console.log("전송된 데이터:", { nickname, email });
  
    try {
      // 이미 존재하는 이메일인지 확인
      const existingUser = await User.findOne({ email }); // findOne 사용
      if (existingUser) {      
        console.log("이미 존재하는 이메일:", email);
        return res.status(400).json({ message: "이미 가입된 이메일입니다." });
      }
  
      // 새로운 사용자 저장
      const newUser = new User({ nickname, email });
      await newUser.save();
  
      // 저장된 사용자 데이터 출력
      console.log("저장된 사용자:", newUser);
      
      res.status(201).json({ message: "회원가입 성공", user: newUser });
    } catch (error) {
      console.error("회원가입 실패:", error);
      res.status(500).json({ message: "서버 오류" });
    }
  });