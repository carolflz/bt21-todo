import { ColorSwatch } from "../common/ColorSwatch";
import styles from "./ColorPicker.module.css";

export const NOTE_COLORS = ["#FFF6B7", "#FFD6E8", "#CFE8FF", "#D3F5DF", "#E3D9FF"];

interface ColorPickerProps {
  selected: string;
  onSelect: (color: string) => void;
}

export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  return (
    <div className={styles.picker} onPointerDown={(e) => e.stopPropagation()}>
      {NOTE_COLORS.map((color) => (
        <ColorSwatch
          key={color}
          color={color}
          selected={selected === color}
          onClick={() => onSelect(color)}
          size={18}
        />
      ))}
    </div>
  );
}
