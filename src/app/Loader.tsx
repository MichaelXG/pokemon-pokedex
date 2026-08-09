"use client";

import React from "react";

import styles from "./Loader.module.scss";

const Loader: React.FC = () => {
  return (
    <div className={styles.loaderContainer} role="status" aria-live="polite">
      <div className={styles.loader} />
      <p className={styles.loadingMessage}>Carregando, por favor aguarde...</p>
    </div>
  );
};

export default Loader;
