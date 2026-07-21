import mascotGif from "../../assets/mascot/mascot.gif";
import styles from "./Mascot.module.css";

export function Mascot() {
  return (
    <div className={styles.mascot}>
      <img src={mascotGif} alt="" />
    </div>
  );
}
