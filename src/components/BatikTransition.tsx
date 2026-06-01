'use client';

import React from 'react';
import styles from './BatikTransition.module.css';

export default function BatikTransition() {
  return (
    <div className={styles.transitionContainer}>
      <div className={styles.ribbonWrapper}>
        <div className={`${styles.ribbon} ${styles.ribbon2}`}></div>
        <div className={`${styles.ribbon} ${styles.ribbon1}`}></div>
      </div>
    </div>
  );
}
