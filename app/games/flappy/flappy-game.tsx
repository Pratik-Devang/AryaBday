'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PixelBuddy } from '../../pixel-buddy';
import styles from './flappy.module.css';

type GameStatus = 'ready' | 'playing' | 'lost' | 'won';
type Pipe = { x: number; gapY: number; counted: boolean };

const WIDTH = 900;
const HEIGHT = 600;
const BIRD_X = 205;
const BIRD_SIZE = 82;
const PIPE_WIDTH = 148;
const PIPE_GAP = 250;
const PIPE_SPEED = 170;
const PIPE_SPACING = 410;
const GRAVITY = 940;
const FLAP_SPEED = -370;
const DEFAULT_TARGET = 5;
const FIXED_GAPS = [300, 345, 255, 365, 285, 335, 240, 315];

export function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundRef = useRef<HTMLImageElement | null>(null);
  const faceRef = useRef<HTMLImageElement | null>(null);
  const pillarRef = useRef<HTMLImageElement | null>(null);
  const birdRef = useRef({ y: HEIGHT / 2, velocity: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const statusRef = useRef<GameStatus>('ready');
  const scoreRef = useRef(0);
  const targetRef = useRef(DEFAULT_TARGET);
  const gapIndexRef = useRef(2);
  const spawnDistanceRef = useRef(0);
  const previousTimeRef = useRef(0);
  const [status, setStatus] = useState<GameStatus>('ready');
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(DEFAULT_TARGET);
  const [previouslyCompleted, setPreviouslyCompleted] = useState(false);

  const changeStatus = useCallback((next: GameStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const resetGame = useCallback(() => {
    birdRef.current = { y: HEIGHT / 2, velocity: 0 };
    pipesRef.current = [
      { x: WIDTH + 80, gapY: FIXED_GAPS[0], counted: false },
    ];
    gapIndexRef.current = 1;
    spawnDistanceRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    changeStatus('playing');
  }, [changeStatus]);

  const flap = useCallback(() => {
    if (statusRef.current === 'playing') {
      birdRef.current.velocity = FLAP_SPEED;
      return;
    }
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    setPreviouslyCompleted(localStorage.getItem('arya-flappy-complete') === 'true');
    const savedTarget = Number(localStorage.getItem('arya-flappy-target'));
    if (savedTarget >= 3 && savedTarget <= 12) {
      targetRef.current = savedTarget;
      setTargetScore(savedTarget);
    }

    const background = new Image();
    background.src = '/game-assets/flappy-background.png';
    backgroundRef.current = background;

    const face = new Image();
    face.src = '/game-assets/arya-face.png';
    faceRef.current = face;

    const pillar = new Image();
    pillar.src = '/game-assets/blanket-pillar.png';
    pillarRef.current = pillar;
  }, []);

  const adjustTarget = (amount: number) => {
    const next = Math.max(3, Math.min(12, targetRef.current + amount));
    targetRef.current = next;
    setTargetScore(next);
    localStorage.setItem('arya-flappy-target', String(next));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;
      event.preventDefault();
      flap();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [flap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrame = 0;

    const drawPillar = (pipe: Pipe, top: boolean) => {
      const image = pillarRef.current;
      const gapTop = pipe.gapY - PIPE_GAP / 2;
      const gapBottom = pipe.gapY + PIPE_GAP / 2;
      const segmentY = top ? 0 : gapBottom;
      const segmentHeight = top ? gapTop : HEIGHT - gapBottom;

      context.save();
      context.beginPath();
      context.rect(pipe.x, segmentY, PIPE_WIDTH, segmentHeight);
      context.clip();

      if (image?.complete) {
        if (top) {
          context.translate(pipe.x + PIPE_WIDTH / 2, segmentHeight / 2);
          context.rotate(Math.PI);
          context.drawImage(image, -PIPE_WIDTH / 2, -segmentHeight / 2, PIPE_WIDTH, segmentHeight);
        } else {
          context.drawImage(image, pipe.x, segmentY, PIPE_WIDTH, segmentHeight);
        }
      } else {
        context.fillStyle = '#172f73';
        context.fillRect(pipe.x, segmentY, PIPE_WIDTH, segmentHeight);
      }
      context.restore();
    };

    const drawScene = () => {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      const background = backgroundRef.current;
      if (background?.complete && background.naturalWidth > 0) {
        const canvasRatio = WIDTH / HEIGHT;
        const imageRatio = background.naturalWidth / background.naturalHeight;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = background.naturalWidth;
        let sourceHeight = background.naturalHeight;

        if (imageRatio > canvasRatio) {
          sourceWidth = background.naturalHeight * canvasRatio;
          sourceX = (background.naturalWidth - sourceWidth) / 2;
        } else {
          sourceHeight = background.naturalWidth / canvasRatio;
          sourceY = (background.naturalHeight - sourceHeight) / 2;
        }

        context.drawImage(background, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, WIDTH, HEIGHT);
        context.fillStyle = 'rgba(255,255,255,.08)';
        context.fillRect(0, 0, WIDTH, HEIGHT);
      } else {
        context.fillStyle = '#ffd8ea';
        context.fillRect(0, 0, WIDTH, HEIGHT);
      }

      context.fillStyle = 'rgba(244,167,199,.82)';
      context.fillRect(0, HEIGHT - 22, WIDTH, 22);
      context.fillStyle = '#5c2645';
      context.fillRect(0, HEIGHT - 22, WIDTH, 4);

      pipesRef.current.forEach((pipe) => {
        drawPillar(pipe, true);
        drawPillar(pipe, false);
      });

      const face = faceRef.current;
      const bird = birdRef.current;
      if (face?.complete) {
        context.save();
        context.translate(BIRD_X, bird.y);
        context.rotate(Math.max(-0.28, Math.min(0.38, bird.velocity / 1100)));
        context.drawImage(face, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
        context.restore();
      } else {
        context.fillStyle = '#ef3e82';
        context.beginPath();
        context.arc(BIRD_X, bird.y, BIRD_SIZE / 2, 0, Math.PI * 2);
        context.fill();
      }
    };

    const finish = (nextStatus: 'lost' | 'won') => {
      changeStatus(nextStatus);
      if (nextStatus === 'won') {
        localStorage.setItem('arya-flappy-complete', 'true');
        setPreviouslyCompleted(true);
      }
    };

    const update = (delta: number) => {
      const bird = birdRef.current;
      bird.velocity += GRAVITY * delta;
      bird.y += bird.velocity * delta;

      const travel = PIPE_SPEED * delta;
      spawnDistanceRef.current += travel;
      pipesRef.current.forEach((pipe) => { pipe.x -= travel; });

      if (spawnDistanceRef.current >= PIPE_SPACING) {
        spawnDistanceRef.current -= PIPE_SPACING;
        const gapY = FIXED_GAPS[gapIndexRef.current % FIXED_GAPS.length];
        gapIndexRef.current += 1;
        pipesRef.current.push({ x: WIDTH + 40, gapY, counted: false });
      }

      pipesRef.current = pipesRef.current.filter((pipe) => pipe.x + PIPE_WIDTH > -20);

      for (const pipe of pipesRef.current) {
        if (!pipe.counted && pipe.x + PIPE_WIDTH < BIRD_X) {
          pipe.counted = true;
          scoreRef.current += 1;
          setScore(scoreRef.current);
          if (scoreRef.current >= targetRef.current) {
            finish('won');
            return;
          }
        }

        const collisionInset = 38;
        const birdHitRadius = BIRD_SIZE * .23;
        const overlapsX = BIRD_X + birdHitRadius > pipe.x + collisionInset && BIRD_X - birdHitRadius < pipe.x + PIPE_WIDTH - collisionInset;
        const outsideGap = bird.y - birdHitRadius < pipe.gapY - PIPE_GAP / 2 || bird.y + birdHitRadius > pipe.gapY + PIPE_GAP / 2;
        if (overlapsX && outsideGap) {
          finish('lost');
          return;
        }
      }

      const edgeRadius = BIRD_SIZE * .28;
      if (bird.y - edgeRadius <= 0 || bird.y + edgeRadius >= HEIGHT - 22) finish('lost');
    };

    const loop = (time: number) => {
      const delta = Math.min((time - previousTimeRef.current) / 1000, .032);
      previousTimeRef.current = time;
      if (statusRef.current === 'playing') update(delta || .016);
      drawScene();
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [changeStatus]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, a')) return;
    flap();
  };

  return (
    <section className={styles.gameWrap} aria-label="Chaddar parinda game">
      <div className={styles.spriteCompanion}><PixelBuddy variant="owlet" label="A tiny owlet cheering from the side" /></div>
      <div className={styles.scoreBar}>
        <span>SCORE <strong>{score}</strong></span>
        <span>TARGET <strong>{targetScore}</strong></span>
        <span>BEST <strong>{previouslyCompleted ? 'CLEARED' : '—'}</strong></span>
      </div>

      <div className={styles.stage} onPointerDown={handlePointerDown}>
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} aria-label="Fly Arya through the blanket towers" />

        {status !== 'playing' && (
          <div className={styles.overlay}>
            {status === 'ready' && (
              <>
                <span className={styles.overlayTag}>READY?</span>
                <h2>DON&apos;T HIT THE BLANKETS!</h2>
                <p>Don't recreate 9/11.</p>
                <div className={styles.targetPicker} aria-label="Choose target score">
                  <button type="button" onClick={() => adjustTarget(-1)} aria-label="Lower target score">−</button>
                  <output>{targetScore}</output>
                  <button type="button" onClick={() => adjustTarget(1)} aria-label="Raise target score">+</button>
                </div>
                <button type="button" onClick={resetGame}>START FLYING</button>
                {previouslyCompleted && <a className={styles.rewardLink} href="/rewards/blanket-flight">VIEW PHOTOS</a>}
              </>
            )}
            {status === 'lost' && (
              <>
                <span className={styles.overlayTag}>BONK!</span>
                <h2>CHADDAR SIKANDAR,<br />PARINDA BANDAR.</h2>
                <p>Parinda sust, chaddar durust. You scored {score}.</p>
                <div className={styles.targetPicker} aria-label="Choose target score">
                  <button type="button" onClick={() => adjustTarget(-1)} aria-label="Lower target score">−</button>
                  <output>{targetScore}</output>
                  <button type="button" onClick={() => adjustTarget(1)} aria-label="Raise target score">+</button>
                </div>
                <button type="button" onClick={resetGame}>TRY AGAIN</button>
              </>
            )}
            {status === 'won' && (
              <>
                <span className={styles.overlayTag}>LEVEL CLEARED!</span>
                <h2>KHILKHILAATI HUI YAADEIN UNLOCKED ♡</h2>
                <p>chaddar nalla, Arya balla</p>
                <a className={styles.rewardLink} href="/rewards/blanket-flight">OPEN PHOTOS</a>
                <button type="button" onClick={resetGame}>PLAY AGAIN</button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
