import React, { useState, useEffect } from 'react';
import './App.css';

// ✅ 統一後端 API（不要再自己拼 api）
const API_BASE = "https://smart-fridge-backend-zbkd.onrender.com";
const API_URL = `${API_BASE}/api`;

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    expiry: '',
    price: '',
    weight: '',
    averageDays: ''
  });

  const [messages, setMessages] = useState([
    { sender: 'ai', text: '你好！我是你的冰箱管家。告訴我你想煮什麼？' }
  ]);

  const [input, setInput] = useState('');
  const [goal, setGoal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // ===============================
  // 🔌 Render 連線測試（只 log，不影響功能）
  // ===============================
  useEffect(() => {
    fetch(`${API_URL}/ping`)
      .then(res => res.json())
      .then(data => console.log('✅ Render 連線成功：', data))
      .catch(err => console.error('❌ Render 連線失敗：', err));
  }, []);

  // ===============================
  // 📦 讀取庫存
  // ===============================
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`);
      if (!res.ok) throw new Error('讀取庫存失敗');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('❌ 讀取庫存錯誤：', err);
    }
  };

  // ===============================
  // ➕ 新增食材
  // ===============================
  const handleAdd = async (e) => {
    e.preventDefault();

    if (
      !newItem.name ||
      !newItem.expiry ||
      !newItem.price ||
      !newItem.weight ||
      !newItem.averageDays
    ) return;

    try {
      const res = await fetch(`${API_URL}/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          expiry: newItem.expiry,
          price: Number(newItem.price),
          weight: newItem.weight,
          averageDays: Number(newItem.averageDays),
          remaining: 100
        }),
      });

      if (res.ok) {
        await fetchItems();
        setNewItem({
          name: '',
          expiry: '',
          price: '',
          weight: '',
          averageDays: ''
        });
      }
    } catch {
      alert('新增失敗，請檢查後端');
    }
  };

  // ===============================
  // 💬 一般 AI 聊天
  // ===============================
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
      setMessages(prev => [...prev, { sender: 'ai', text: 'AI 暫時無法回應' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ===============================
  // 🧠 智慧冰箱顧問
  // ===============================
  const handleSmartSuggest = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: `🧠 智慧建議請求：「${goal}」` }
    ]);

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

  // ===============================
  // 📊 視覺數據
  // ===============================
  const MAX_CAPACITY = 20;
  const currentCount = items.length;
  const spaceUsed = Math.round((currentCount / MAX_CAPACITY) * 100);
  const totalValue = items.reduce((sum, i) => sum + Number(i.price || 0), 0);
  const spaceColor =
    spaceUsed > 80 ? '#e74c3c' :
    spaceUsed > 50 ? '#f1c40f' :
    '#2ecc71';

  // ===============================
  // 🖥️ UI
  // ===============================
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
      {/* 左側 */}
      <div style={{ flex: 1 }}>
        <h1 style={{ color: '#2c3e50' }}>🥕 我的智慧冰箱</h1>

        {/* 儀表板 */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1, background: 'white', padding: '15px', borderRadius: '10px' }}>
            <h4>📦 空間</h4>
            <div style={{ height: '20px', background: '#ecf0f1', borderRadius: '10px' }}>
              <div style={{ width: `${spaceUsed}%`, background: spaceColor, height: '100%' }} />
            </div>
            <div style={{ textAlign: 'right' }}>{currentCount}/{MAX_CAPACITY}</div>
          </div>

          <div style={{ flex: 1, background: 'white', padding: '15px', borderRadius: '10px' }}>
            <h4>💰 總價值</h4>
            <div style={{ fontSize: '2em' }}>${totalValue}</div>
          </div>
        </div>

        {/* 新增表單 */}
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px' }}>
          <h3>➕ 放入食材</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="名稱" value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
            <input type="number" placeholder="價格" value={newItem.price}
              onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
            <input placeholder="重量" value={newItem.weight}
              onChange={e => setNewItem({ ...newItem, weight: e.target.value })} />
            <input type="number" placeholder="平均天數" value={newItem.averageDays}
              onChange={e => setNewItem({ ...newItem, averageDays: e.target.value })} />
            <input type="date" value={newItem.expiry}
              onChange={e => setNewItem({ ...newItem, expiry: e.target.value })} />
            <button type="submit">寫入</button>
          </form>
        </div>

        {/* 庫存清單 */}
        <div style={{ marginTop: '20px' }}>
          <h3>📋 目前庫存</h3>
          {items.map(item => (
            <div key={item.id}
              style={{
                background: 'white',
                marginBottom: '8px',
                padding: '10px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
              <div>
                <strong>{item.name}</strong> ({item.weight})
                <div>到期：{item.expiry} ｜ ${item.price}</div>
              </div>
              <div>剩 {item.remaining}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* 右側 AI */}
      <div style={{ width: '350px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#6c5ce7', color: 'white', padding: '15px' }}>
          🤖 AI 廚房助手
        </div>

        <form onSubmit={handleSmartSuggest} style={{ padding: '10px', display: 'flex' }}>
          <input value={goal} onChange={e => setGoal(e.target.value)}
            placeholder="想煮什麼？" style={{ flex: 1 }} />
          <button type="submit">🧠</button>
        </form>

        <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i}
              style={{
                textAlign: m.sender === 'user' ? 'right' : 'left',
                marginBottom: '8px'
              }}>
              {m.text}
            </div>
          ))}
          {isTyping && <div>AI 思考中…</div>}
        </div>

        <form onSubmit={handleSendAI} style={{ display: 'flex' }}>
          <input value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1 }} />
          <button type="submit">🚀</button>
        </form>
      </div>
    </div>
  );
}

export default App;

