// src/components/Modal.js
import React, { useRef, useEffect } from "react";

const Modal = ({ children, onClose, className }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose(); // 외부 클릭 시 onClose 호출
    }
  };

  // 모달이 열릴 때 메인 페이지 스크롤 비활성화
  useEffect(() => {
    document.body.style.overflow = "hidden"; // 스크롤 비활성화
    return () => {
      document.body.style.overflow = "auto"; // 모달 닫힐 때 스크롤 활성화
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleClickOutside} // 부모 div에서 클릭 이벤트 감지
    >
      <div
        ref={modalRef} // 내부 요소 참조 설정
        className={`modal-content ${className}`}  // "modal-content h-3/5 w-full max-w-3xl bg-white p-6 rounded shadow-lg overflow-y-auto" // 내부 스크롤 활성화
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
