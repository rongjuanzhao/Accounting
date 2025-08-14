import React, { useState } from 'react';
import { useCategories } from '../contexts/CategoryContext';
import './CategoryManagement.css';

// 默认分类和子项配置
const defaultCategories = {
  '流动资金': { defaultItems: ['银行活期', '支付宝', '微信'], icon: '💰' },
  '固定资产': { defaultItems: ['车辆价值', '房产价值'], icon: '🏠' },
  '投资理财': { defaultItems: ['定期存款', '股票基金'], icon: '📈' },
  '应收款项': { defaultItems: ['他人借款'], icon: '📋' },
  '负债': { defaultItems: ['车贷', '房贷', '借贷'], icon: '💳' }
};

export default function CategoryManagement() {
  const { addCustomItem, deleteCustomItem, categories } = useCategories();
  const [newItemName, setNewItemName] = useState({});
  const [activeCategory, setActiveCategory] = useState('流动资金');

  const handleAddItem = (category) => {
    const itemName = newItemName[category]?.trim();
    if (!itemName) return;
    addCustomItem(category, itemName);
    setNewItemName(prev => ({ ...prev, [category]: '' }));
  };

  const handleDeleteItem = (category, index) => {
    deleteCustomItem(category, index);
  };

  return (
    <div className="category-management">
      <h2 style={{ textAlign: 'left' }}>分类管理</h2>
      
      <div className="category-tabs">
        {Object.keys(defaultCategories).map(category => (
          <button
            key={category}
            className={`tab-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            <span className="category-icon">{defaultCategories[category].icon}</span>
            {category}
          </button>
        ))}
      </div>

      <div className="category-content">
        {Object.keys(categories).map(category => (
          activeCategory === category && (
            <div key={category} className="category-section">
              <h3>{defaultCategories[category].icon} {category}</h3>
              
              <div className="items-list">
                <h4>默认子项</h4>
                <div className="default-items">
                  {categories[category]?.defaultItems?.map((item, index) => (
                    <div key={`default-${index}`} className="item default-item">
                      <span>{item}</span>
                      <span className="item-type">默认</span>
                    </div>
                  ))}
                </div>

                <h4>自定义子项</h4>
                <div className="custom-items">
                  {categories[category]?.customItems?.map((item, index) => (
                    <div key={`custom-${index}`} className="item custom-item">
                      <span>{item}</span>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteItem(category, index)}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>

                <div className="add-item-section">
                  <input
                    type="text"
                    placeholder="输入新子项名称"
                    value={newItemName[category] || ''}
                    onChange={(e) => setNewItemName(prev => ({ ...prev, [category]: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem(category)}
                  />
                  <button 
                    className="add-btn"
                    onClick={() => handleAddItem(category)}
                  >
                    添加子项
                  </button>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}