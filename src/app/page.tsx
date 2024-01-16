import Image from "next/image";
import styles from "./page.module.css";
import ChipSelector from "@/components/ChipSelector";
export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Chip selector Component</h1>
      <ChipSelector />
    </main>
  );
}
