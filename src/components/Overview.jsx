import { useState, useRef } from 'react';
import './Overview.css';
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

  // 更新资产数据的方法
  const handleUpdateData = (name, value) => {
    setAssetsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
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
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="header">
          <h2 style={{ textAlign: 'left' }}>资产总览</h2>
          <button
            className="update-button"
            onClick={() => setModalVisible(true)}
          >
            更新资产
          </button>
        </header>

        {modalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>更新资产</h3>
                <button
                  className="close-button"
                  onClick={() => setModalVisible(false)}
                >
                  ×
                </button>
              </div>
              <Form
                initialData={assetsData}  // 传递当前资产数据作为初始数据
                onUpdateData={handleUpdateData}
                onSubmit={handleSubmit} // 传递提交回调
              />
            </div>
          </div>
        )}

        <div className="dashboard">
          <div className="card summary-card">
            <h3>资产总览</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <label>总资产</label>
                <div className="stat-value">¥{totalAssets.toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <label>净资产</label>
                <div className="stat-value">¥{netWorth.toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <label>负债</label>
                <div className="stat-value positive">¥{liabilitiesData.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="card chart-card">
            <h3>资产构成</h3>
            <div
              ref={chartRef}
              className="chart-container"
              style={{ width: '100%', height: '400px' }}
            >
              <SankeyDiagram 
                data={assetsData}
                netWorth={netWorth} // 新增
              />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Overview;


