import styles from "./ColorSwatch.module.css";

interface ColorSwatchProps {
  color: string;
  selected?: boolean;
  onClick?: () => void;
  size?: number;
}

export function ColorSwatch({ color, selected, onClick, size = 20 }: ColorSwatchProps) {
  return (
    <button
      type="button"
      className={[styles.swatch, selected ? styles.selected : ""].join(" ")}
      style={{ backgroundColor: color, width: size, height: size }}
      onClick={onClick}
      aria-label={`color ${color}`}
    />
  );
}
