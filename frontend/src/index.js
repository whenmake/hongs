// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // 루트 컴포넌트
import "./index.css"; // Tailwind CSS 파일
import './styles/styles.css';


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
  <App />
</React.StrictMode>
);

