import type { Metadata } from 'next';
import Link from 'next/link';
import { DodgerGame } from './dodger-game';
import styles from './dodger.module.css';

export const metadata: Metadata = {
  title: "Face Dodge | Arya's Birthday Adventure",
  description: 'Move left and right, dodge the incoming faces, and unlock khilkhilaati hui yaadein.',
};

export default function DodgerPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← HOME</Link>
        <div>
          <p>LEVEL 02</p>
          <h1>FACE DODGE</h1>
        </div>
        <span className={styles.goal}>GOAL: 12</span>
      </header>
      <DodgerGame />
      <p className={styles.hint}>Use ← → or A D. On mobile, tap either side or use the buttons.</p>
    </main>
  );
}
