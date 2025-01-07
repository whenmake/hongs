// // src/pages/MainPage.js
// import React, { useState, useEffect } from "react";
// import { getAuth, signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import Header from "..//components/Header";
// import ChapterGrid from "../components/ChapterGrid";
// import Modal from "../components/Modal";
// import NoteOverlay from "../components/NoteOverlay";
// import { fetchCompleted, fetchNotes, toggleComplete, saveNote } from "../services/api";

// const MainPage = () => {
//   const [completed, setCompleted] = useState(Array(7).fill(false)); // 기본값: 7개의 칸 모두 미완료
//   const [notes, setNotes] = useState(Array(7).fill([])); // 기본값: 빈 노트 배열
//   const [selectedDay, setSelectedDay] = useState(null); // 선택된 날짜
//   const [isOverlayOpen, setIsOverlayOpen] = useState(false); // 오버레이 상태
//   const [isNoteOverlayOpen, setIsNoteOverlayOpen] = useState(false);
//   const navigate = useNavigate();
//   const auth = getAuth();
  

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [completedData, notesData] = await Promise.all([
//           fetchCompleted(),
//           fetchNotes(),
//         ]);
  
//         // 완료 상태 데이터 처리
//         const completedArray = Array(7).fill(false);
//         if (completedData.data && completedData.data.length > 0) {
//           completedData.data.forEach((item) => {
//             if (item.day !== undefined && item.status === true) {
//               completedArray[item.day] = true; // 완료 상태 true로 설정
//             }
//           });
//         }
  
//         setCompleted(completedArray); // 완료 상태 업데이트
//         setNotes(notesData.data || Array(7).fill([])); // 노트 데이터 업데이트
//       } catch (error) {
//         console.error("데이터 로드 실패:", error);
//       }
//     };
  
//     loadData();
//   }, []);

//   const handleChapterClick = (index) => {
//     setSelectedDay(index); // 클릭한 칸의 인덱스 저장
//     setIsOverlayOpen(true); // 상세 오버레이 열기
//   };

//   const handleOverlayClose = () => {
//     setIsOverlayOpen(false); // 상세 오버레이 닫기
//     setSelectedDay(null); // 선택된 날짜 초기화
//   };

//   const handleOpenNoteOverlay = () => {
//     setIsOverlayOpen(false); // 상세 오버레이 닫기
//     setIsNoteOverlayOpen(true); // 노트 작성 오버레이 열기
//   };

//   const handleNoteOverlayClose = () => {
//     setIsNoteOverlayOpen(false); // 노트 작성 오버레이 닫기
//     setIsOverlayOpen(true); // 상세 오버레이 열기
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       alert("로그아웃 성공!");
//       navigate("/login"); // 로그인 페이지로 이동
//     } catch (error) {
//       console.error("로그아웃 실패:", error);
//       alert("로그아웃 실패");
//     }
//   };

//   // 완독 체크 버튼 클릭
//   const handleCompleteToggle = async () => {
//     if (selectedDay === null) return;
//     const updatedStatus = !completed[selectedDay];
//     const nickname = "사용자닉네임"; // 닉네임을 임의로 설정 또는 상태로 관리

//     try {
//       await toggleComplete(selectedDay, updatedStatus, nickname); // API 호출
//       setCompleted((prev) => {
//         console.log("Saving completed:", { selectedDay, updatedStatus, nickname });
//         const updated = [...prev];
//         updated[selectedDay] = updatedStatus; // 상태 업데이트
//         return updated;
//       });
//     } catch (error) {
//       console.error("완독 상태 업데이트 실패:", error);
//     }
//   };

//    // 노트 저장
//    const handleSaveNote = async (day, content) => {
//     const nickname = "사용자닉네임"; // 닉네임을 임의로 설정 또는 상태로 관리
//     content = content || "기본 내용"; // 기본값 설정
//     console.log("Saving Note:", { day, content, nickname });
  
//     if (typeof day !== "number" || !content || !nickname) {
//       console.error("Invalid data format:", { day, content, nickname });
//       return;
//     }
  
//     try {
//       await saveNote(day, content, nickname);
//       alert("노트가 성공적으로 저장되었습니다.");
//       // 노트 오버레이 닫기
//       handleNoteOverlayClose();      
//     } catch (error) {
//       console.error("노트 저장 실패:", error);
//       alert("노트 저장에 실패했습니다.");
//     }
//   };
  
  
  
//   return (
//     <div className="relative">
//       <div className="absolute top-4 right-4">
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           로그아웃
//         </button>
//       </div>
//       <Header />
//       <ChapterGrid completed={completed} onChapterClick={handleChapterClick} />
//       {isOverlayOpen && selectedDay !== null && (
//         <Modal onClose={handleOverlayClose}>
//           <div className="text-center">
//             <h2 className="text-xl font-bold mb-4">성경 {selectedDay + 1}장</h2>
//             <button
//               className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               onClick={() => window.open("https://www.youtube.com", "_blank")}
//             >
//               영상 링크
//             </button>
//             <button
//               className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//               onClick={handleCompleteToggle}
//             >
//               {completed[selectedDay] ? "완독 취소" : "완독 체크"}
//             </button>
//             <button
//               className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//               onClick={handleOpenNoteOverlay}
//             >
//               노트 작성
//             </button>
//           </div>
//         </Modal>
//       )}
//       {isNoteOverlayOpen && (
//         <Modal onClose={handleNoteOverlayClose}>
//           <NoteOverlay
//             day={selectedDay}
//             notes={notes[selectedDay]}
//             onSave={(content) => handleSaveNote(selectedDay, content)}
//             onClose={handleNoteOverlayClose}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default MainPage;


// import React, { useState, useEffect } from "react";
// import { getAuth, signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import Header from "..//components/Header";
// import ChapterGrid from "../components/ChapterGrid";
// import Modal from "../components/Modal";
// import NoteOverlay from "../components/NoteOverlay";
// import {
//   fetchCompleted,
//   fetchNotes,
//   toggleComplete,
//   saveNote,
//   fetchAllNotes,
//   likeNote,
//   deleteNote,
// } from "../services/api";
// // JSON 데이터 로드
// import bibleData from "../data/data.json"; // JSON 파일 경로


// const MainPage = () => {
//   const [completed, setCompleted] = useState(Array(322).fill(false)); // 기본값: 7개의 칸 모두 미완료
//   const [notes, setNotes] = useState(Array(322).fill([])); // 기본값: 빈 노트 배열
//   const [selectedDay, setSelectedDay] = useState(null); // 선택된 날짜
//   const [isOverlayOpen, setIsOverlayOpen] = useState(false); // 상세 오버레이 상태
//   const [isNoteOverlayOpen, setIsNoteOverlayOpen] = useState(false); // 노트 작성 오버레이 상태
//   const [isViewingNotes, setIsViewingNotes] = useState(false); // 노트 보기 상태
//   const [allNotes, setAllNotes] = useState([]); // 모든 사용자 노트
//   // const [bibleChapters, setBibleChapters] = useState([]); // 성경 데이터
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const nickname = localStorage.getItem("nickname");
 
//  // 완료 상태 로드    
//   useEffect(() => {
//     const loadCompletedData = async () => {
//       try {
//         const completedData = await fetchCompleted(nickname); // 완료 상태만 불러오기
//         const completedArray = Array(322).fill(false);
  
//         if (completedData.data && completedData.data.length > 0) {
//           completedData.data.forEach((item) => {
//             if (item.day !== undefined && item.status === true) {
//               completedArray[item.day] = true; // 완료 상태 true로 설정
//             }
//           });
//         }
  
//         console.log("불러온 completedArray:", completedArray); // 디버깅용 로그
//         setCompleted(completedArray); // 완료 상태 업데이트
//       } catch (error) {
//         console.error("완독 상태 로드 실패:", error);
//       }
//     };
  
//     loadCompletedData(); // 완료 상태만 초기 로드
//   }, [nickname]); // nickname 변경 시 완료 상태만 다시 로드
  
  
//   const handleChapterClick = async (index) => {
//     setSelectedDay(index); // 클릭한 칸의 인덱스 저장
//     setIsOverlayOpen(true); // 상세 오버레이 열기

//     try {
//       const response = await fetchAllNotes(index); // 해당 날짜의 모든 노트 불러오기
//       setAllNotes(response.data || []);
//     } catch (error) {
//       console.error("모든 노트 불러오기 실패:", error);
//     }
//   };

//   const handleOverlayClose = () => {
//     setIsOverlayOpen(false); // 상세 오버레이 닫기
//     setSelectedDay(null); // 선택된 날짜 초기화
//   };

//   // 노트 오버레이 열림/닫힘 상태를 토글하는 함수
// const handleNoteOverlayToggle = async () => {
//   if (selectedDay === null) return;

//   const updatedStatus = !isNoteOverlayOpen; // 현재 상태 반대로 설정

//   try {
//     if (updatedStatus) {
//       // 노트 오버레이를 열 때 노트 데이터를 로드
//       await loadNotesForSelectedDay(); // 노트 상태 로드
//     }
//     setIsNoteOverlayOpen(updatedStatus); // 상태 업데이트
//     setIsOverlayOpen(!updatedStatus); // 상세 오버레이 상태 반대 설정
//   } catch (error) {
//     console.error("노트 오버레이 상태 업데이트 실패:", error);
//   }
// };


//   // 노트 보기를 클릭했을 때만 노트 상태 로드
//   const handleOpenNoteOverlay = async () => {
//     setIsOverlayOpen(false); // 상세 오버레이 닫기
//     setIsNoteOverlayOpen(true); // 노트 작성 오버레이 열기
//     await loadNotesForSelectedDay(); // 노트 상태 로드
//   };

//   const handleNoteOverlayClose = () => {
//     setIsNoteOverlayOpen(false); // 노트 작성 오버레이 닫기
//     setIsOverlayOpen(true); // 상세 오버레이 열기
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       alert("로그아웃 성공!");
//       navigate("/login"); // 로그인 페이지로 이동
//     } catch (error) {
//       console.error("로그아웃 실패:", error);
//       alert("로그아웃 실패");
//     }
//   };

//   //  "완독 취소" : "완독 체크"
//   const handleCompleteToggle = async () => {
//     if (selectedDay === null) return;
//     const updatedStatus = !completed[selectedDay];

//     try {
//       await toggleComplete(selectedDay, updatedStatus, nickname); // API 호출
//       setCompleted((prev) => {
//         const updated = [...prev];
//         updated[selectedDay] = updatedStatus; // 상태 업데이트
//         return updated;
//       });
//     } catch (error) {
//       console.error("완독 상태 업데이트 실패:", error);
//     }
//   };

//   const handleSaveNote = async (day, content) => {
//     try {
//       await saveNote(day, content, nickname);
//       // alert("노트가 성공적으로 저장되었습니다.");
//       setIsViewingNotes(true); // 노트 보기 상태로 변경
//       handleNoteOverlayClose(); // 노트 작성 오버레이 닫기

//       // 저장된 노트 불러오기
//       const response = await fetchAllNotes(day);
//       setAllNotes(response.data || []);
//     } catch (error) {
//       console.error("노트 저장 실패:", error);
//       alert("노트 저장에 실패했습니다.");
//     }
//   };

//   const handleLikeNote = async (noteId) => {
//     try {
//       await likeNote(noteId);
//       const updatedNotes = allNotes.map((note) =>
//         note._id === noteId
//           ? { ...note, likes: note.likes + 1 }
//           : note
//       );
//       setAllNotes(updatedNotes);
//     } catch (error) {
//       console.error("좋아요 실패:", error);
//     }
//   };

//   const handleDeleteNote = async (noteId) => {
//     try {
//       await deleteNote(noteId);
//       const updatedNotes = allNotes.filter((note) => note._id !== noteId);
//       setAllNotes(updatedNotes);
//     } catch (error) {
//       console.error("노트 삭제 실패:", error);
//     }
//   };

//   // 노트 보기에서 노트 상태 불러오기
// const loadNotesForSelectedDay = async () => {
//   if (selectedDay === null) return; // 선택된 날짜가 없으면 실행하지 않음

//   try {
//     const notesData = await fetchNotes(selectedDay); // 노트 상태 불러오기
//     setNotes(notesData.data || []); // 노트 데이터 업데이트
//   } catch (error) {
//     console.error("노트 데이터 로드 실패:", error);
//   }
// };

//   return (
//     <div className="relative">
//       <div className="absolute top-4 right-4">
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           로그아웃
//         </button>
//       </div>
//       <Header />

//       <ChapterGrid completed={completed} onChapterClick={handleChapterClick} />
//       {isOverlayOpen && selectedDay !== null && (
//         <Modal onClose={handleOverlayClose}>
//           <div className="text-center">
//             <h2 className="text-xl font-bold mb-4">
//               {bibleData[selectedDay]?.구분 || "구약개관"}
//             </h2>
//             <p>{bibleData[selectedDay]?.["1일차"] || ""}</p>
//             <button
//               className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 gap-40"
//               onClick={() => window.open("https://www.youtube.com", "_blank")}
//             >
//               통독 영상
//             </button>
//             <button
//               className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//               onClick={handleCompleteToggle}
//             >
//               {completed[selectedDay] ? "완독 취소" : "완독 체크"}
//             </button>
//             <button
//               className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//               onClick={isViewingNotes ? null : handleNoteOverlayToggle}
//             >
//               {isViewingNotes ? "노트 보기" : "노트 작성"}
//             </button>
//           </div>
//           {isViewingNotes && (
//             <div className="mt-4">
//               <h3 className="text-lg font-bold">작성된 노트</h3>
//               <ul>
//                 {allNotes.map((note) => (
//                   <li key={note._id} className="mb-2">
//                     <p>{note.content}</p>
//                     <div className="flex justify-between items-center">
//                       <span>좋아요: {note.likes}</span>
//                       <button
//                         className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
//                         onClick={() => handleLikeNote(note._id)}
//                       >
//                         좋아요
//                       </button>
//                       {note.nickname === nickname && (
//                         <button
//                           className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                           onClick={() => handleDeleteNote(note._id)}
//                         >
//                           삭제
//                         </button>
//                       )}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </Modal>
//       )}
//       {isNoteOverlayOpen && (
//         <Modal onClose={handleNoteOverlayClose}>
//           <NoteOverlay
//             day={selectedDay}
//             notes={notes[selectedDay]}
//             onSave={(content) => handleSaveNote(selectedDay, content)}
//             onClose={handleNoteOverlayClose}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default MainPage;


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
  const nickname = localStorage.getItem("nickname");
  const [selectedValue, setSelectedValue] = useState(""); // 선택된 칸의 값


  useEffect(() => {
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
  
    loadCompletedData(); // 완료 상태만 초기 로드
  }, [nickname]); // nickname 변경 시 완료 상태만 다시 로드
  

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
  
  // const handleChapterClick = async (index, value) => {
  //   setSelectedDay(index); // 클릭한 칸의 인덱스 저장
  //   setIsOverlayOpen(true); // 상세 오버레이 열기
  //   setSelectedValue(value); // 클릭한 칸의 값을 저장
  //   setIsViewingNotes(false); // 노트 보기 상태 초기화

  //   try {
  //     const response = await fetchNotes(index);
  //     setAllNotes(response.data || []);
  //   } catch (error) {
  //     console.error("모든 노트 불러오기 실패:", error);
  //   }
  // };
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
  
  // const handleLikeNote = async (noteId) => {
  //   try {
  //     // 현재 노트에서 해당 유저가 좋아요를 눌렀는지 확인
  //     const noteIndex = allNotes.findIndex((note) => note._id === noteId);
  //     if (noteIndex === -1) return; // 노트를 찾지 못하면 종료
  
  //     const note = allNotes[noteIndex];
  //     const userLiked = note.likedBy?.some((user) => user === nickname); // 정확히 nickname이 있는지 확인
  
  //     const updatedNotes = [...allNotes];
  //     if (userLiked) {
  //       // 좋아요 취소
  //       updatedNotes[noteIndex].likedBy = note.likedBy.filter(
  //         (user) => user !== nickname
  //       ); // 좋아요 목록에서 유저 제거
  //       updatedNotes[noteIndex].likes -= 1; // 좋아요 수 감소
  //       await likeNote(noteId, false); // API 호출 (좋아요 취소)
  //     } else {
  //       // 좋아요 추가
  //       updatedNotes[noteIndex].likedBy = [...(note.likedBy || []), nickname]; // 좋아요 목록에 유저 추가
  //       updatedNotes[noteIndex].likes += 1; // 좋아요 수 증가
  //       await likeNote(noteId, true); // API 호출 (좋아요 추가)
  //     }
  
  //     setAllNotes(updatedNotes); // 로컬 상태 업데이트
  
  //     // 서버에서 데이터 동기화 (옵션)
  //     const response = await fetchAllNotes(selectedDay); // 현재 선택된 날짜의 모든 노트 다시 로드
  //     if (response.data) {
  //       setAllNotes(response.data); // 최신 데이터로 상태 업데이트
  //     }
  //   } catch (error) {
  //     console.error("좋아요 처리 실패:", error);
  //   }
  // };
  

  // 노트를 저장할 때도 최신순으로 정렬
  // const handleSaveNote = async (day, content) => {
  //   try {
  //     await saveNote(day, content, nickname);
  //     console.log("노트가 성공적으로 저장되었습니다.");
  //     setIsViewingNotes(true);
  //     setIsNoteOverlayOpen(false);
  //     setIsOverlayOpen(true);
  //     const response = await fetchAllNotes(day); // 노트를 다시 불러옴
  //     setAllNotes(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // 최신순으로 정렬
  //   } catch (error) {
  //     console.error("노트 저장 실패:", error);
  //     alert("노트 저장에 실패했습니다.");
  //   }
  // };

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
      // setIsNoteOverlayOpen(false);
      // setIsOverlayOpen(true);

    //   // 서버에서 최신 데이터 다시 로드
    //   const response = await fetchNotes(index); // 노트를 다시 불러옴
    //   // console.log("데이터:", response);
    //   setAllNotes(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    //   // console.log("노트 데이터:", response.data);
    //   if (response.status === 200) {
    //     // alert("노트가 성공적으로 저장되었습니다.");
    //     console.log("저장된 노트 데이터:", response.data);
    //   }
            
    // } catch (error) {
    //   console.error("노트 저장 실패:", error);
    //   alert("노트 저장에 실패했습니다.");
    // }
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
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 실패");
    }
  };


  return (
    <div className="relative">
      <div className="absolute top-4 right-4">
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
