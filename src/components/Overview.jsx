import { useState, useEffect, useRef } from 'react';
import styles from './Overview.module.css';
import Form from './Form.jsx';
import Sidebar from './Sidebar.jsx';
import SankeyDiagram from './SankeyDiagram.jsx';

const Overview = () => {
  const chartRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [Liabilities, setLiabilities] = useState(233)
  const [assetsData, setAssetsData] = useState({
    currentDeposit: 0, // 银行活期
    alipay: 0,        // 支付宝
    wechat: 0,        // 微信
    car: 0,           // 车辆价值
    house: 0,         // 房产价值
    fixedDeposit: 0,  // 定期存款
    stocks: 0,        // 股票基金
    receivable: 0,         // 他人借款
    carLoan: 0,       // 车贷
    mortgage: 0,      // 房贷
    borrowing: 0      // 借贷
  });

  // 在组件挂载时从后端获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bills');
        console.log('API响应状态:', response.status);
        
        if (response.ok) {
          const text = await response.text();
          console.log('API原始响应:', text);
          
          if (text && text !== 'bills' && text.length > 5) {
            try {
              const data = JSON.parse(text);
              console.log('解析后的数据:', data);
              
              if (data && data.length > 0 && data[0].description) {
                setAssetsData(data[0].description);
              } else {
                console.log('使用默认数据');
                setAssetsData({
                  currentDeposit: 50000,
                  alipay: 10000,
                  wechat: 5000,
                  car: 150000,
                  house: 3000000,
                  fixedDeposit: 200000,
                  stocks: 100000,
                  receivable: 0,
                  carLoan: 50000,
                  mortgage: 2000000,
                  borrowing: 0
                });
              }
            } catch (parseError) {
              console.error('JSON解析错误:', parseError);
              setAssetsData({
                currentDeposit: 50000,
                alipay: 10000,
                wechat: 5000,
                car: 150000,
                house: 3000000,
                fixedDeposit: 200000,
                stocks: 100000,
                receivable: 0,
                carLoan: 50000,
                mortgage: 2000000,
                borrowing: 0
              });
            }
          } else {
            console.log('使用默认数据');
            setAssetsData({
              currentDeposit: 50000,
              alipay: 10000,
              wechat: 5000,
              car: 150000,
              house: 3000000,
              fixedDeposit: 200000,
              stocks: 100000,
              receivable: 0,
              carLoan: 50000,
              mortgage: 2000000,
              borrowing: 0
            });
          }
        } else {
          console.error('API响应错误:', response.status);
          setAssetsData({
            currentDeposit: 50000,
            alipay: 10000,
            wechat: 5000,
            car: 150000,
            house: 3000000,
            fixedDeposit: 200000,
            stocks: 100000,
            receivable: 0,
            carLoan: 50000,
            mortgage: 2000000,
            borrowing: 0
          });
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        setAssetsData({
          currentDeposit: 50000,
          alipay: 10000,
          wechat: 5000,
          car: 150000,
          house: 3000000,
          fixedDeposit: 200000,
          stocks: 100000,
          receivable: 0,
          carLoan: 50000,
          mortgage: 2000000,
          borrowing: 0
        });
      }
    };

    // 只在API调用失败时使用默认数据
    // 移除直接设置默认数据的代码
    
    // 实际调用fetchData函数获取数据
    fetchData();
  }, []);

  // 更新资产数据的方法
  const handleUpdateData = (name, value) => {
    setAssetsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('提交表单数据:', assetsData);
      // 发送数据到后端API
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assetsData),
      });

      if (response.ok) {
        console.log('数据保存成功');
        // 重新获取数据以确保显示最新数据
        const fetchResponse = await fetch('/api/bills');
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          if (data && data.length > 0 && data[0].description) {
            setAssetsData(data[0].description);
          }
        }
      } else {
        console.error('数据保存失败');
      }
    } catch (error) {
      console.error('保存数据时出错:', error);
    }
    
    console.log('关闭模态框');
    setModalVisible(false); // 关闭模态框
  };

  // 计算总资产
  // const totalAssets = Object.values(assetsData).reduce((sum, value) => sum + value, 0);

  const totalAssets = Object.entries(assetsData).reduce((sum, [key, value]) => {
    const liabilities = ['carLoan', 'mortgage', 'borrowing'];
    return liabilities.includes(key) ? sum - value : sum + value;
  }, 0);


  // 计算净资产（总资产减去固定资产和他人借款）
  const netWorth = totalAssets - (assetsData.car + assetsData.house + assetsData.receivable);
  //计算负债数据
  const liabilitiesData = assetsData.carLoan + assetsData.mortgage + assetsData.borrowing;

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h2 style={{ textAlign: 'left' }}>资产总览</h2>
          <button
            className={styles.updateButton}
            onClick={() => {
              console.log('按钮被点击，准备显示弹窗');
              setModalVisible(true);
            }}
          >
            更新资产
          </button>
        </header>

        {modalVisible && (
          <div className={styles.modalOverlay} onClick={() => {
            console.log('点击遮罩层关闭模态框');
            setModalVisible(false);
          }}>
            <div className={styles.modalContent} onClick={(e) => {
              console.log('点击模态框内容区域');
              e.stopPropagation();
            }}>
              <div className={styles.modalHeader}>
                <h3>更新资产信息</h3>
                <button
                  className={styles.closeButton}
                  onClick={() => {
                    console.log('关闭按钮被点击');
                    setModalVisible(false);
                  }}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <Form
                  initialData={assetsData}
                  onUpdateData={handleUpdateData}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        )}

        <div className={styles.verticalLayout}>
          {/* 资产总览 - 上半部分 */}
          <div className={styles.sectionCard}>
            <h3>资产总览</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <label>总资产</label>
                <div className={styles.statValue}>¥{totalAssets.toLocaleString()}</div>
              </div>
              <div className={styles.statItem}>
                <label>净资产</label>
                <div className={styles.statValue}>¥{netWorth.toLocaleString()}</div>
              </div>
              <div className={styles.statItem}>
                <label>负债</label>
                <div className={styles.statValue + ' ' + styles.positive}>¥{liabilitiesData.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          {/* 资产构成 - 下半部分 */}
          <div className={styles.sectionCard}>
            <h3>资产构成</h3>
            <div
              ref={chartRef}
              className={styles.chartContainer}
              style={{ width: '100%', height: '500px' }}
            >
              <SankeyDiagram 
                data={assetsData}
                netWorth={netWorth}
              />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Overview;


