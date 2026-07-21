import { HTMLAttributes } from "react";
import styles from "./RoundedCard.module.css";

export function RoundedCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.card, className].filter(Boolean).join(" ")} {...props} />;
}
