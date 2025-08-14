import React from 'react';
import { Link , useLocation} from 'react-router-dom';
import './Sidebar.css';

const menuItems = [
  { name: '总览', path: '/' },
  { name: '分类管理', path: '/category-management' }
];

export default function Sidebar() {
   const location = useLocation();

  return (
    <nav className="sidebar">
      <div className="logo">个人财务管理</div>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}