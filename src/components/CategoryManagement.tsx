"use client";

import React, { useState } from 'react';
import { useCategories } from '../contexts/CategoryContext';
import styles from './CategoryManagement.module.css';

// 默认分类和子项配置
const defaultCategories: { [key: string]: { defaultItems: string[]; icon: string } } = {
  '流动资金': { defaultItems: ['银行活期', '支付宝', '微信'], icon: '💰' },
  '固定资产': { defaultItems: ['车辆价值', '房产价值'], icon: '🏠' },
  '投资理财': { defaultItems: ['定期存款', '股票基金'], icon: '📈' },
  '应收款项': { defaultItems: ['他人借款'], icon: '📋' },
  '负债': { defaultItems: ['车贷', '房贷', '借贷'], icon: '💳' }
};

interface NewItemName {
  [key: string]: string;
}

export default function CategoryManagement() {
  const { addCustomItem, deleteCustomItem, categories } = useCategories();
  const [newItemName, setNewItemName] = useState<NewItemName>({});
  const [activeCategory, setActiveCategory] = useState<string>('流动资金');

  const handleAddItem = (category: string) => {
    const itemName = newItemName[category]?.trim();
    if (!itemName) return;
    addCustomItem(category, itemName);
    setNewItemName(prev => ({ ...prev, [category]: '' }));
  };

  const handleDeleteItem = (category: string, index: number) => {
    deleteCustomItem(category, index);
  };

  return (
    <div className={styles.categoryManagement}>
      <h2 style={{ textAlign: 'left' }}>分类管理</h2>
      
      <div className={styles.categoryTabs}>
        {Object.keys(defaultCategories).map(category => (
          <button
            key={category}
            className={`${styles.tabButton} ${activeCategory === category ? styles.active : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            <span className={styles.categoryIcon}>{defaultCategories[category].icon}</span>
            {category}
          </button>
        ))}
      </div>

      <div className={styles.categoryContent}>
        {Object.keys(categories).map(category => (
          activeCategory === category && (
            <div key={category} className={styles.categorySection}>
              <h3>{defaultCategories[category].icon} {category}</h3>
              
              <div className={styles.itemsList}>
                <h4>默认子项</h4>
                <div className={styles.defaultItems}>
                  {categories[category]?.defaultItems?.map((item, index) => (
                    <div key={`default-${index}`} className={`${styles.item} ${styles.defaultItem}`}>
                      <span>{item}</span>
                      <span className={styles.itemType}>默认</span>
                    </div>
                  ))}
                </div>

                <h4>自定义子项</h4>
                <div className={styles.customItems}>
                  {categories[category]?.customItems?.map((item, index) => (
                    <div key={`custom-${index}`} className={`${styles.item} ${styles.customItem}`}>
                      <span>{item}</span>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteItem(category, index)}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>

                <div className={styles.addItemSection}>
                  <input
                    type="text"
                    placeholder="输入新子项名称"
                    value={newItemName[category] || ''}
                    onChange={(e) => setNewItemName(prev => ({ ...prev, [category]: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem(category)}
                  />
                  <button 
                    className={styles.addBtn}
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