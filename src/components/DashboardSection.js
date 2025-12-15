import React from 'react';

export default function DashboardSection({ items, newItem, setNewItem, handleAdd, max, totalValue }) {
  const spaceUsed = Math.round((items.length / max) * 100);
  const color = spaceUsed > 80 ? 'high' : spaceUsed > 50 ? 'mid' : 'low';

  return (
    <div className="card">
      <div className="dashboard">
        <div className="dash-box">
          <h4>📦 空間使用</h4>
          <div className="progress-bar">
            <div className={`progress-fill ${color}`} style={{ width: `${spaceUsed}%` }}></div>
          </div>
          <div className="dash-info">{items.length}/{max}</div>
        </div>
        <div className="dash-box">
          <h4>💰 總價值</h4>
          <div className="dash-value">${totalValue}</div>
        </div>
      </div>

      <form onSubmit={handleAdd}>
        <input placeholder="名稱" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
        <input type="number" placeholder="價格" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
        <input placeholder="重量 (如300g)" value={newItem.weight} onChange={e => setNewItem({...newItem, weight: e.target.value})} required />
        <input type="date" value={newItem.expiry} onChange={e => setNewItem({...newItem, expiry: e.target.value})} required />
        <button type="submit">寫入</button>
      </form>
    </div>
  );
}
