"use client";

import { useState } from 'react';
import styles from './Form.module.css';
import Form from './Form';

// 定义类型
interface FormData {
  [key: string]: number;
}

interface AssetUpdateModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialData?: FormData;
  onSubmit?: (formData: FormData) => void;
}

const AssetUpdateModal = ({ isVisible, onClose, initialData, onSubmit }: AssetUpdateModalProps) => {
  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  const handleSubmit = (formData: FormData) => {
    // 调用父组件传递的onSubmit函数
    if (typeof onSubmit === 'function') {
      onSubmit(formData);
    }
    // 关闭模态框
    onClose();
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={(e) => {
        // 点击遮罩层关闭模态框
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>更新资产信息</h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <Form
            initialData={initialData}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetUpdateModal;