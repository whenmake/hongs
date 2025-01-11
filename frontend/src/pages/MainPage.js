import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "..//components/Header";
import ChapterGrid from "../components/ChapterGrid";
import Modal from "../components/Modal";
import NoteOverlay from "../components/NoteOverlay";
import NoteBox from "../components/NoteBox"; // NoteBox 컴포넌트 추가
import {
  fetchCompleted,
  fetchNotes,
  toggleComplete,
  saveNote,
  fetchAllNotes,
  likeNote,
  deleteNote,
} from "../services/api";
import bibleData from "../data/data.json"; // JSON 파일 경로
// import { fetchCompleted } from './api'; // fetchCompleted 함수가 포함된 API 호출 파일
import { useLocation } from "react-router-dom";

const MainPage = () => {
  const [completed, setCompleted] = useState(Array(322).fill(false));
  const [notes, setNotes] = useState(Array(322).fill([]));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isNoteOverlayOpen, setIsNoteOverlayOpen] = useState(false);
  const [isViewingNotes, setIsViewingNotes] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  // const nickname = localStorage.getItem("nickname");
  const [selectedValue, setSelectedValue] = useState(""); // 선택된 칸의 값
  const location = useLocation();
  const nickname = location.state?.nickname; // 로그인 페이지에서 전달받은 닉네임


  useEffect(() => {
    if (!nickname) {
      console.error("닉네임이 없습니다. 로그인 페이지로 이동합니다.");
      // 닉네임이 없을 경우 로그인 페이지로 리다이렉트
      navigate("/");
    } else {
      console.log("받아온 닉네임:", nickname);
      loadCompletedData();
    }    
  }, [nickname]); // nickname 변경 시 완료 상태만 다시 로드
  
  const loadCompletedData = async () => {
    try {
      const completedData = await fetchCompleted(nickname); // 완료 상태만 불러오기
      console.log("불러온 completedData:", completedData.data); // 디버깅용 로그
      const completedArray = Array(322).fill(false);

      if (completedData.data && completedData.data.length > 0) {
        completedData.data.forEach((item) => {
          if (item.index !== undefined && item.status === true) {
            completedArray[item.index] = true; // 완료 상태 true로 설정
          }
        });
      }

      console.log("불러온 completedArray:", completedArray); // 디버깅용 로그
      setCompleted(completedArray); // 완료 상태 업데이트
    } catch (error) {
      console.error("완독 상태 로드 실패:", error);
    }
  };

  const handleCompleteToggle = async () => {
      if (selectedIndex === null) return;
      const updatedStatus = !completed[selectedIndex];
  
      try {
        await toggleComplete(selectedIndex, updatedStatus, nickname);
        setCompleted((prev) => {
          const updated = [...prev];
          updated[selectedIndex] = updatedStatus;
          return updated;
        });
      } catch (error) {
        console.error("완독 상태 업데이트 실패:", error);
      }
    };
 
  const handleChapterClick = async (index, value) => {
    console.log("handleChapterClick 호출, index 값:", index, value); // 디버깅용 로그
    try {
      if (index === null || index === undefined) {
        throw new Error("index 파라미터가 필요합니다.");
      }
      setSelectedIndex(index); // 선택된 index 상태 업데이트
      setIsOverlayOpen(true); // 오버레이 열기
      setSelectedValue(value); // 클릭한 칸의 값을 저장
      setIsViewingNotes(false); // 노트 보기 상태 초기화
      // const notes = await fetchNotes(index); // index 값을 fetchNotes에 전달
      // setAllNotes(notes.data); // 노트 데이터 업데이트
    } catch (error) {
      console.error("모든 노트 불러오기 실패:", error);
    }
  };
  
  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
    setSelectedIndex(null);
  };

  const handleNoteOverlayToggle = async () => {
    if (isNoteOverlayOpen) {
      setIsNoteOverlayOpen(false);
      setIsOverlayOpen(true); // 이전 오버레이 복구
    } else {
      setIsOverlayOpen(false);
      setIsNoteOverlayOpen(true);

      try {
        const response = await fetchNotes(selectedIndex);
        console.log("노트 데이터 불러오기 성공:", response.data);
      
        if (response.data && response.data.length > 0) {
          // 노트가 있는 경우
          setAllNotes(response.data);
        } else {
          // 노트가 없는 경우 처리
          console.log("해당 인덱스에 작성된 노트가 없습니다.");
          setAllNotes([]); // 빈 상태로 초기화
        }
      } catch (error) {
        console.error("노트 데이터 불러오기 실패:", error);
      }
      
    }
  };

  const handleLikeNote = async (noteId) => {
    console.log("좋아요 처리 시작: 노트 ID:", noteId); // 디버깅용  
      // 현재 노트에서 해당 유저가 좋아요를 눌렀는지 확인
      const noteIndex = allNotes.findIndex((note) => note._id === noteId);
      if (!noteId) {
        console.error("노트 ID가 유효하지 않습니다.");
        return;
      }
      try {
        const noteIndex = allNotes.findIndex((note) => note._id === noteId);
        if (noteIndex === -1) {
          console.error("노트를 찾을 수 없습니다:", noteId);
          return;
        }
    
      const note = allNotes[noteIndex];
      const userLiked = note.likedBy?.includes(nickname); // 현재 유저가 좋아요를 눌렀는지 확인
      console.log(`현재 유저 (${nickname})가 좋아요를 눌렀는지: ${userLiked}`);

      if (userLiked) {
        // 좋아요 취소
        await likeNote(noteId, false, nickname);
      } else {
        // 좋아요 추가
        await likeNote(noteId, true, nickname);
      }
      // const updatedNotes = [...allNotes];
      // if (userLiked) {
      //   // 좋아요 취소
      //   updatedNotes[noteIndex].likedBy = note.likedBy.filter(
      //     (user) => user !== nickname
      //   ); // 좋아요 목록에서 유저 제거
      //   updatedNotes[noteIndex].likes -= 1; // 좋아요 수 감소
      //   await likeNote(noteId, false); // API 호출 (좋아요 취소)
      // } else {
      //   // 좋아요 추가
      //   updatedNotes[noteIndex].likedBy = [...(note.likedBy || []), nickname]; // 좋아요 목록에 유저 추가
      //   updatedNotes[noteIndex].likes += 1; // 좋아요 수 증가
      //   await likeNote(noteId, true); // API 호출 (좋아요 추가)
      // }
      const response = await fetchAllNotes(selectedIndex);
    if (response.data) {
      // setAllNotes(response.data);
      setAllNotes(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // 최신순으로 정렬
    }
    
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };
  
  const handleSaveNote = async (index, content, nickname) => {
    if (!content || !nickname || index === undefined) {
      console.error("유효하지 않은 데이터:", { index, content, nickname });
      return;
    }
    try {
      console.log("노트 저장 시작:", { index, content, nickname });
      const response = await saveNote(index, content, nickname); // API 호출
      console.log("노트 저장 성공:", response.data);
      setIsViewingNotes(true);
  
      setAllNotes((prevNotes) => [response.data, ...prevNotes]); // 상태 업데이트
    } catch (error) {
      console.error("노트 저장 실패:", error);
    }
 
  };
  
  // 노트를 불러올 때도 최신순으로 정렬
  const loadNotesForSelectedIndex = async () => {
    if (selectedIndex === null) return;
  
    try {
      const response = await fetchNotes(selectedIndex);
      setNotes(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // 최신순으로 정렬
    } catch (error) {
      console.error("노트 데이터 로드 실패:", error);
    }
  };
  
  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      const updatedNotes = allNotes.filter((note) => note._id !== noteId);
      setAllNotes(updatedNotes);
    } catch (error) {
      console.error("노트 삭제 실패:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("로그아웃 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 실패");
    }
  };


  return (
    <div className="relative">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
      {/* 닉네임 */}
      <p className="text-lg font-medium text-white ">{nickname}</p>
      {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>
      <Header />
      <ChapterGrid completed={completed} onChapterClick={handleChapterClick} />
      {isOverlayOpen && selectedIndex !== null && (
        <Modal onClose={handleOverlayClose} className="chapter-modal">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">{selectedValue}</h2> {/* 선택된 값 표시 */}            
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
              onClick={() => window.open("https://youtu.be/obvBe-eO498?si=avDEdaDWZNaDCYOG", "_blank")}
            >
              통독 영상
            </button>
            <button
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
              onClick={handleCompleteToggle}
            >
              {completed[selectedIndex] ? "완독 취소" : "완독 체크"}
            </button>
            <button
              className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={handleNoteOverlayToggle}
            >
              {isViewingNotes ? "노트 보기" : "노트 작성"}
            </button>
          </div>
        </Modal>
      )}
      {isNoteOverlayOpen && (
        <Modal onClose={handleNoteOverlayToggle} className="note-modal" >
          <NoteOverlay
             index={selectedIndex}
             notes={notes[selectedIndex]}
             onSave={(content) => handleSaveNote(selectedIndex, content, nickname)}
             onClose={handleNoteOverlayToggle}
           />
           <div className="mt-4 max-h-[500px] overflow-y-auto">
           <h3 className="text-lg font-bold mb-4">작성된 노트</h3>
              {allNotes.length === 0 ? (
                <p className="text-gray-500">아직 작성된 노트가 없습니다.</p>
              ) : (
                allNotes.map((note) => (
                  <NoteBox key={note._id} note={note} onLike={handleLikeNote} delNote={handleDeleteNote} currentUser={nickname} />
                ))
              )}
          </div>          
        </Modal>
      )}
    </div>
  );
};

export default MainPage;
