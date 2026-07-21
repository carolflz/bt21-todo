import { useState } from "react";
import { BTS_QUOTES } from "../../data/btsQuotes";
import styles from "./DailyQuote.module.css";

const STORAGE_KEY = "todoapp.dailyQuote";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function dailyIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  return Math.floor(diff / 86400000) % BTS_QUOTES.length;
}

function loadStoredIndex(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.day === todayKey() ? parsed.index : null;
  } catch {
    return null;
  }
}

function storeIndex(index: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ day: todayKey(), index }));
  } catch {
    return;
  }
}

export function DailyQuote() {
  const [index, setIndex] = useState(() => loadStoredIndex() ?? dailyIndex());

  function shuffle() {
    let next = Math.floor(Math.random() * BTS_QUOTES.length);
    if (next === index && BTS_QUOTES.length > 1) {
      next = (next + 1) % BTS_QUOTES.length;
    }
    setIndex(next);
    storeIndex(next);
  }

  const quote = BTS_QUOTES[index];

  return (
    <div className={styles.card}>
      <div className={styles.textBlock}>
        <p className={styles.quote}>&ldquo;{quote.text}&rdquo;</p>
        <span className={styles.source}>{quote.source}</span>
      </div>
      <button
        type="button"
        className={styles.shuffleBtn}
        onClick={shuffle}
        title="Shuffle quote"
        aria-label="Shuffle quote"
      >
        🔀
      </button>
    </div>
  );
}
