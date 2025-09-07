"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const menuItems = [
  { name: '总览', path: '/' },
  { name: '分类管理', path: '/category-management' }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>个人财务管理</div>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}