import React from 'react';
import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
        <div className={styles.centeredContent}>
        <p>IBSheet React Sample</p>
        </div>
    </div>
  );
};
