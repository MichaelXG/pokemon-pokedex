"use client";

import React from "react";

import styles from "./Loader.module.scss"; // Importa os estilos para o loader

const Loader: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader} />
      <p className={styles.loadingMessage}>
        Carregando, por favor aguarde...
      </p>{" "}
      {/* Mensagem de carregamento */}
    </div>
  );
};

export default Loader;
