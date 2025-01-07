// src/services/api.js
import axios from "axios";

export const checkNickname = async (uid) => {
  if (!uid) {
    throw new Error("UID가 필요합니다.");
  }
  // GET 요청으로 UID 전달
  return axios.get(`/api/check-nickname?uid=${uid}`);
};

// 완독 가져오기기
// export const fetchCompleted = () => axios.get("http://localhost:5000/api/completed");
export const fetchCompleted = async (nickname) => {
  if (!nickname) {
    throw new Error("nickname 파라미터가 필요합니다."); // nickname이 없으면 에러 발생
  }

  try {
    const response = await axios.get(`http://localhost:5000/api/completed`, {
      params: { nickname },
    });
    console.log("fetchCompleted 응답:", response);
    return response;
  } catch (error) {
    console.error("fetchCompleted 실패:", error);
    throw error;
  }
};

// 완독 표시하기 토글글
export const toggleComplete = (index, status, nickname) =>
  axios.post("http://localhost:5000/api/completed", { index, status, nickname }); // userId 포함 여부 확인

// 노트 가져오기 날짜 기준
export const fetchNotes = (index) => {
  console.log("fetchNotes 호출, index 값:", index); // 디버깅용 로그
  if (index === undefined || index === null) {
    return Promise.reject(new Error("index 파라미터가 필요합니다."));
  }
  return axios.get(`http://localhost:5000/api/notes?index=${index}`);
};

// 모든 노트 가져오기 (특정 날짜 기준)
export const fetchAllNotes = (index) => axios.get(`http://localhost:5000/api/notes?index=${index}`);

// 노트 저장
export const saveNote = (index, content, nickname) => {
  if (typeof index !== "number" || !content || !nickname) {
    console.error("Invalid data format:", { index, content, nickname });
    return Promise.reject("Invalid data format");
  }

  return axios.post("http://localhost:5000/api/notes/save", { index, content, nickname });
};

// 노트 삭제
export const deleteNote = (id) => axios.delete(`http://localhost:5000/api/notes/${id}`);

// 노트 좋아요 추가/취소
// export const likeNote = (id, userId) => axios.post(`http://localhost:5000/api/notes/${id}/like`, { userId });
// 노트 좋아요 추가/취소 API 요청
export const likeNote = (id, like, nickname) => {
  return axios.post(`http://localhost:5000/api/notes/${id}/like`, {
    nickname,
    like,
  });
};

// 요청 및 응답 로깅용 Interceptors
axios.interceptors.request.use((request) => {
  console.log("Starting Request", request);
  return request;
});

axios.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Response Error:", error.response || error.message);
    return Promise.reject(error);
  }
);