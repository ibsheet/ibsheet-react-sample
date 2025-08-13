// components/TabBar.tsx
import React from 'react';
import type { Tab } from './TabTypes';
import styles from './TabBar.module.scss';

interface TabBarProps {
  tabs: Tab[];
  activeRoute: string | null;
  onSelect: (tab: Tab) => void;
  onClose: (tab: Tab) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeRoute, onSelect, onClose }) => {
  return (
    <div className={styles['tab-bar']}>
      {tabs.map(tab => (
        <div
          key={tab.route}
          className={`${styles.tab} ${tab.route === activeRoute ? styles.active : ''}`}
          onClick={() => onSelect(tab)}
        >
          <span className={styles['tab-title']}>{tab.title}</span>
          <span
            className={styles['close-btn']}
            onClick={e => {
              e.stopPropagation();
              onClose(tab);
            }}
          >
            ×
          </span>
        </div>
      ))}
    </div>
  );
};
