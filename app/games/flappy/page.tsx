import type { Metadata } from 'next';
import Link from 'next/link';
import { FlappyGame } from './flappy-game';
import styles from './flappy.module.css';

export const metadata: Metadata = {
  title: "Blanket Flight | Arya's Birthday Adventure",
  description: 'Fly through the blanket towers to unlock khilkhilaati hui yaadein.',
};

export default function FlappyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← HOME</Link>
        <div>
          <p>LEVEL 01</p>
          <h1>CHADDAR PARINDA</h1>
        </div>
        <span className={styles.goal}>CUSTOM GOAL</span>
      </header>
      <FlappyGame />
      <p className={styles.hint}>Tap, click, or press Space to fly.</p>
    </main>
  );
}
