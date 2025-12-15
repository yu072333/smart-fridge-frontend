import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // 引用 CSS 樣式

// 找到網頁上的 'root' 節點，並把 App 畫上去
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);