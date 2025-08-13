import React from 'react';
import styles from './sidebar.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faShieldHalved, faBus, faTv } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface MenuItem {
  title: string;
  route?: string;
  icon?: IconDefinition
}

interface SidebarProps {
  activeRoute: string;
  onMenuClick: (item: MenuItem) => void;
}

const menuItems: MenuItem[] = [
  { title: '인천국제공항공사_국가별 항공 통계 서비스', route: 'pages/flight', icon: faPlane },
  { title: '행정안전부_민방위대피시설', route: 'pages/civil', icon: faShieldHalved },
  { title: '서울시_정류장 운행 통계', route: 'pages/bus', icon: faBus },
  { title: '넷플릭스_국가별 최고 인기 작품 (영화, TV)', route: 'pages/netflix', icon: faTv },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeRoute, onMenuClick }) => {
  return (
    <div className={styles.sidebar}>
      {menuItems.map(item => (
        <div
          key={item.route}
          className={`${styles['menu-item']} ${activeRoute === item.route ? styles.active : ''}`}
          onClick={() => onMenuClick(item)}
        >
          {item.icon && <FontAwesomeIcon icon={item.icon} className={styles.icon} />}
          <span className={styles.title}>{item.title}</span>
        </div>
      ))}
    </div>
  );
};
