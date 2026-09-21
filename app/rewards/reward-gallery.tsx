'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PixelBuddy } from '../pixel-buddy';
import styles from './rewards.module.css';

type RewardGalleryProps = {
  eyebrow: string;
  title: string;
  storageKey: string;
  gameHref: string;
  photos: string[];
  variant: 'pink' | 'gold';
};

export function RewardGallery({ eyebrow, title, storageKey, gameHref, photos, variant }: RewardGalleryProps) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    setUnlocked(localStorage.getItem(storageKey) === 'true');
  }, [storageKey]);

  if (unlocked === null) {
    return <main className={`${styles.page} ${styles[variant]}`} aria-busy="true" />;
  }

  if (!unlocked) {
    return (
      <main className={`${styles.page} ${styles[variant]}`}>
        <section className={styles.locked}>
          <span>LOCKED</span>
          <h1>WIN THE GAME FIRST</h1>
          <p>This photo collection is waiting on the other side.</p>
          <Link href={gameHref}>PLAY THE GAME</Link>
          <Link href="/" className={styles.secondaryLink}>BACK HOME</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={`${styles.page} ${styles[variant]}`}>
      <header className={styles.header}>
        <Link href="/">← HOME</Link>
        <div className={styles.rewardTitle}><PixelBuddy variant={variant === 'pink' ? 'pink' : 'dude'} /><div><p>{eyebrow}</p><h1>{title}</h1></div></div>
        <span>{photos.length} PHOTOS</span>
      </header>
      <section className={styles.gallery} aria-label={title}>
        {photos.map((photo, index) => (
          <figure key={photo} className={styles.photoCard}>
            <img src={photo} alt={`Unlocked birthday yaad ${index + 1}`} loading={index < 4 ? 'eager' : 'lazy'} />
            <figcaption>YAAD {String(index + 1).padStart(2, '0')}</figcaption>
          </figure>
        ))}
      </section>
      <footer className={styles.footer}>COLLECTION COMPLETE ♡</footer>
    </main>
  );
}
