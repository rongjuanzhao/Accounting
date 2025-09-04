import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Sidebar.module.css';

const menuItems = [
  { name: '总览', path: '/' },
  { name: '分类管理', path: '/category-management' }
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>个人财务管理</div>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`${styles.navItem} ${router.pathname === item.path ? styles.active : ''}`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}