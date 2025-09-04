import { useState, useEffect } from 'react';
import { useCategories } from '../contexts/CategoryContext';
import styles from './Form.module.css';


const Form = ({ onUpdateData, onSubmit, initialData = {} }) => {  // 添加initialData属性
  const { getAllCategoriesWithItems } = useCategories();
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState({});

  // 根据分类数据动态生成表单结构
  useEffect(() => {
    const allCategories = getAllCategoriesWithItems();
    const initialFormData = {};
    
    Object.entries(allCategories).forEach(([category, items]) => {
      items.forEach((item, index) => {
        // 将中文转换为英文字段名
        const fieldName = convertToFieldName(category, item, index);
        // 使用传入的初始数据，如果没有则默认为0
        initialFormData[fieldName] = initialData[fieldName] !== undefined ? initialData[fieldName] : 0;
      });
    });
    
    setFormData(initialFormData);
    setCategories(allCategories);
  }, [getAllCategoriesWithItems, initialData]);  // 添加initialData到依赖数组

  // 将中文分类和子项转换为英文字段名
  const convertToFieldName = (category, item, index) => {
    const categoryMap = {
      '流动资金': {
        '银行活期': 'currentDeposit',
        '支付宝': 'alipay',
        '微信': 'wechat'
      },
      '固定资产': {
        '车辆价值': 'car',
        '房产价值': 'house'
      },
      '投资理财': {
        '定期存款': 'fixedDeposit',
        '股票基金': 'stocks'
      },
      '应收款项': {
        '他人借款': 'receivable'
      },
      '负债': {
        '车贷': 'carLoan',
        '房贷': 'mortgage',
        '借贷': 'borrowing'
      }
    };

    // 对于默认子项，使用预定义的字段名
    if (categoryMap[category] && categoryMap[category][item]) {
      return categoryMap[category][item];
    } else {
      // 为自定义子项创建唯一标识符，包含索引确保唯一性
      const safeCategory = category.replace(/[^a-zA-Z0-9]/g, '');
      const safeItem = item.replace(/[^a-zA-Z0-9]/g, '');
      return `${safeCategory}_${safeItem}_${index}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Math.max(0, Number(value) || 0);
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 提交时一次性更新所有数据
    Object.entries(formData).forEach(([key, value]) => {
      onUpdateData(key, value);
    });

    if (typeof onSubmit === 'function') {
      onSubmit(formData);
    }
  };

  const renderFormFields = () => {
    if (!categories || Object.keys(categories).length === 0) {
      return <div>加载中...</div>;
    }

    return Object.entries(categories).map(([category, items]) => (
      <fieldset key={category} className={styles.formSection}>
        <legend>{category}</legend>
        {items.map((item, index) => {
          const fieldName = convertToFieldName(category, item, index);
          return (
            <div key={fieldName} className={styles.formItem}>
              <label>{item}：</label>
              <input className={styles.numberInput}
                type="number"
                name={fieldName}
                value={formData[fieldName] !== undefined ? formData[fieldName] : 0}  // 使用formData中的值
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          );
        })}
      </fieldset>
    ));
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      {renderFormFields()}
      <button type="submit" className={styles.submitButton}>
        提交资产信息
      </button>
    </form>
  );
};

export default Form;