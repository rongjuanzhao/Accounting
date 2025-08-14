
import { Routes, Route } from 'react-router-dom';
import { CategoryProvider } from './contexts/CategoryContext';
import Overview from './components/Overview';
import Sidebar from './components/Sidebar';
import CategoryManagement from './components/CategoryManagement';

function App() {
  return (
    <CategoryProvider>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/category-management" element={<CategoryManagement />} />
        </Routes>
      </div>
    </CategoryProvider>
  );
}

export default App;