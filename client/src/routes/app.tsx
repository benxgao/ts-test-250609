import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetch(`/api/insights`)
      .then((res) => res.json())
      .then((data) => {
        setInsights(data);
      });
  }, [refreshTrigger]);

  const forceRefresh = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <main className={styles.main}>
      <Header onRefresh={forceRefresh} />
      <Insights
        className={styles.insights}
        insights={insights}
        onRefresh={forceRefresh}
      />
    </main>
  );
};
