import React from 'react';

export default function ChatPanel({ messages, input, setInput, handleSendAI, isTyping }) {
  return (
    <div className="chatbot">
      <div className="chat-header">🤖 AI 廚房助手</div>
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender}`}>
            {m.text}
          </div>
        ))}
        {isTyping && <div className="typing">AI 思考中...</div>}
      </div>
      <form onSubmit={handleSendAI} className="chat-footer">
        <input placeholder="問我食譜或補貨..." value={input} onChange={e => setInput(e.target.value)} />
        <button>🚀</button>
      </form>
    </div>
  );
}
