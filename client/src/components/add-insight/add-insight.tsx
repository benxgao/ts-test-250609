import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";
import { useState } from "react";

type AddInsightProps = ModalProps & { onRefresh: () => void };

export const AddInsight = (props: AddInsightProps) => {
  const [brandId, setBrandId] = useState(BRANDS[0]?.id || "");
  const [insightText, setInsightText] = useState("");

  const addInsight = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: brandId,
          text: insightText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      props.setModalOpen(false);
      props.onRefresh();
    } catch (error) {
      console.error("Error adding insight:", error);
    }
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          <select
            className={styles["field-input"]}
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          >
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            value={insightText}
            onChange={(e) => setInsightText(e.target.value)}
          />
        </label>
        <Button className={styles.submit} type="submit" label="Add insight" />
      </form>
    </Modal>
  );
};
