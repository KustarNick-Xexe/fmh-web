import React from "react";
import "./NewsMainWindow.css";
import NewsWindow from "../../news/ui/NewsWindow";
import StatementPage from "../../statementPage/ui/StatementPage";
import styles from "./main.module.css";

const MainPage = () => {
  return (
    <div className={styles['main']}>
      <NewsWindow hiddenControls />
      <StatementPage
        rollup={styles.icon_rollup} 
        filter={styles.icon_filter} 
      />
    </div>
  );
}

export default MainPage;
