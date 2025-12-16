// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = "https://smart-fridge-backend-zbkd.onrender.com";


function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', expiry: '', price: '', weight: '', averageDays: '' });
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '你好！我是你的冰箱管家。告訴我你想煮什麼？' }
  ]);
  const [input, setInput] = useState('');
  const [goal, setGoal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 讀取庫存資料
  // --- 測試 Render 連線狀態 ---
useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL || "https://smart-fridge-backend-zbkd.onrender.com"}/api/ping`)
    .then((res) => res.json())
    .then((data) => console.log("✅ Render 連線成功：", data))
    .catch((err) => console.error("❌ Render 連線失敗：", err));
}, []);

  
  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`);
      if (!res.ok) throw new Error("連線錯誤");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 新增食材
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.expiry || !newItem.price || !newItem.weight || !newItem.averageDays) return;

    try {
      const res = await fetch(`${API_URL}/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          expiry: newItem.expiry,
          price: Number(newItem.price),
          weight: newItem.weight,
          averageDays: newItem.averageDays,
          remaining: 100,
        }),
      });

      if (res.ok) {
        await fetchItems();
        setNewItem({ name: '', expiry: '', price: '', weight: '', averageDays: '' });
      }
    } catch {
      alert('連線失敗');
    }
  };

  // 一般聊天（問保存、問食譜）
  const handleSendAI = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/ask-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'ai', text: '大腦當機中...' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // 智慧冰箱顧問
  const handleSmartSuggest = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: `🧠 智慧建議請求：「${goal}」` }]);
    setGoal('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/smart-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'ai', text: '顧問暫時離線中…' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // 視覺數據
  const MAX_CAPACITY = 20;
  const currentCount = items.length;
  const spaceUsed = Math.round((currentCount / MAX_CAPACITY) * 100);
  const totalValue = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const spaceColor = spaceUsed > 80 ? '#e74c3c' : spaceUsed > 50 ? '#f1c40f' : '#2ecc71';

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '20px',
        padding: '20px',
        fontFamily: 'Microsoft JhengHei',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      {/* 左側主要內容 */}
      <div style={{ flex: 1 }}>
        <h1 style={{ color: '#2c3e50' }}>🥕 我的智慧冰箱</h1>

        {/* 儀表板 */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1, background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>📦 空間</h4>
            <div style={{ height: '20px', background: '#ecf0f1', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${spaceUsed}%`, background: spaceColor, height: '100%' }}></div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.9em' }}>{currentCount}/{MAX_CAPACITY}</div>
          </div>
          <div style={{ flex: 1, background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>💰 總價值</h4>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#2c3e50' }}>${totalValue}</div>
          </div>
        </div>

        {/* 新增表單 */}
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>➕ 放入食材</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
            <input style={{ flex: 2, padding: '8px' }} type="text" placeholder="名稱 (如: 雞胸肉)" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} required />
            <input style={{ flex: 1, padding: '8px' }} type="number" placeholder="價格" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} required />
            <input style={{ flex: 1, padding: '8px' }} type="text" placeholder="重量 (如: 300g)" value={newItem.weight} onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })} required />
            <input style={{ flex: 1, padding: '8px' }} type="number" placeholder="平均購買天數" value={newItem.averageDays} onChange={(e) => setNewItem({ ...newItem, averageDays: e.target.value })} required />
            <input style={{ flex: 1, padding: '8px' }} type="date" value={newItem.expiry} onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })} required />
            <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', padding: '0 15px' }}>寫入</button>
          </form>
        </div>

        {/* 庫存清單 */}
        <div className="inventory-list">
          <h3 style={{ borderBottom: '2px solid #eee' }}>📋 目前庫存</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {items.map(item => (
              <div
                key={item.id || `${item.name}-${item.expiry}`}
                style={{ background: 'white', border: '1px solid #eee', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <strong>{item.name}</strong>
                  <span style={{ marginLeft: '10px', color: '#666', background: '#eee', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9em' }}>
                    {item.weight || '未標示'}
                  </span>
                  <div style={{ color: '#666', fontSize: '0.9em' }}>
                    到期日: {item.expiry} ｜ 💰${item.price}
                  </div>
                </div>
                <div style={{ textAlign: 'right', color: item.remaining < 30 ? '#d89a9e' : '#27ae60' }}>
                  剩 {item.remaining}% 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右側 AI 區域 */}
      <div
        style={{
          width: '350px',
          minWidth: '350px',
          flexShrink: 0,
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #ddd',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <div style={{ background: '#6c5ce7', color: 'white', padding: '15px' }}>🤖 AI 廚房助手</div>

        {/* 智慧冰箱顧問區 */}
        <form onSubmit={handleSmartSuggest} style={{ padding: '10px', display: 'flex', gap: '10px', background: '#fafafa', borderBottom: '1px solid #eee' }}>
          <input
            type="text"
            placeholder="輸入想做的料理（例：番茄雞胸沙拉）"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
          />
          <button type="submit" style={{ background: '#A3B9A7', color: 'white', border: 'none', borderRadius: '6px', padding: '0 10px' }}>
            🧠
          </button>
        </form>

        {/* 聊天訊息區 */}
        <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#f5f6fa', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((msg, i) => (
            <div
              key={msg.text + i}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? '#6c5ce7' : 'white',
                color: msg.sender === 'user' ? 'white' : 'black',
                padding: '10px',
                borderRadius: '10px',
                maxWidth: '80%'
              }}
            >
              {msg.text}
            </div>
          ))}
          {isTyping && <div style={{ color: '#999', fontSize: '0.8em' }}>AI 思考中...</div>}
        </div>

        {/* 原本的聊天輸入框 */}
        <form onSubmit={handleSendAI} style={{ padding: '10px', display: 'flex' }}>
          <input
            type="text"
            placeholder="問我食譜或補貨..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: '10px' }}
          />
          <button type="submit">🚀</button>
        </form>
      </div>
    </div>
  );
}

export default App;
