import React from 'react';

export default function InventoryList({ items }) {
  return (
    <div className="card inventory-list">
      <h3>📋 目前庫存</h3>
      {items.map(item => (
        <div key={item.id} className="inventory-item">
          <div>
            <strong>{item.name}</strong>
            <span className="tag">{item.weight || '未標示'}</span>
            <div className="meta">到期日: {item.expiry} | ${item.price}</div>
          </div>
          <small style={{ color: item.remaining < 30 ? '#d89a9e' : '#A3B9A7' }}>剩 {item.remaining}%</small>
        </div>
      ))}
    </div>
  );
}
