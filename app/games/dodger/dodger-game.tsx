'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PixelBuddy } from '../../pixel-buddy';
import styles from './dodger.module.css';

type GameStatus = 'ready' | 'playing' | 'lost' | 'won';
type Obstacle = { lane: number; y: number; sprite: number; counted: boolean };

const WIDTH = 720;
const HEIGHT = 760;
const LANES = [140, 360, 580];
const PLAYER_Y = 650;
const PLAYER_SIZE = 104;
const OBSTACLE_SIZE = 96;
const TARGET = 12;
const SPRITES = Array.from({ length: 6 }, (_, index) => `/game-assets/dodger/face-${index + 1}.png`);
const LANE_PATTERN = [1, 0, 2, 1, 2, 0, 0, 2, 1, 0, 2, 1];

export function DodgerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const backgroundRef = useRef<HTMLImageElement | null>(null);
  const statusRef = useRef<GameStatus>('ready');
  const laneRef = useRef(1);
  const displayXRef = useRef(LANES[1]);
  const playerSpriteRef = useRef(0);
  const obstacleIndexRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const spawnTimerRef = useRef(0);
  const previousTimeRef = useRef(0);
  const scoreRef = useRef(0);
  const [status, setStatus] = useState<GameStatus>('ready');
  const [score, setScore] = useState(0);
  const [previouslyCompleted, setPreviouslyCompleted] = useState(false);

  const changeStatus = useCallback((next: GameStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const startGame = useCallback(() => {
    laneRef.current = 1;
    displayXRef.current = LANES[1];
    playerSpriteRef.current = 0;
    obstacleIndexRef.current = 0;
    obstaclesRef.current = [];
    spawnTimerRef.current = .35;
    scoreRef.current = 0;
    setScore(0);
    changeStatus('playing');
  }, [changeStatus]);

  const move = useCallback((direction: -1 | 1) => {
    if (statusRef.current !== 'playing') return;
    laneRef.current = Math.max(0, Math.min(2, laneRef.current + direction));
  }, []);

  useEffect(() => {
    setPreviouslyCompleted(localStorage.getItem('arya-dodger-complete') === 'true');
    imagesRef.current = SPRITES.map((source) => {
      const image = new Image();
      image.src = source;
      return image;
    });
    const background = new Image();
    background.src = '/game-assets/dodger/hello-kitty-background.jpg';
    backgroundRef.current = background;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        event.preventDefault();
        move(-1);
      }
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        event.preventDefault();
        move(1);
      }
      if (event.code === 'Space' && statusRef.current !== 'playing') {
        event.preventDefault();
        startGame();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move, startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrame = 0;

    const drawContained = (image: HTMLImageElement | undefined, centerX: number, centerY: number, size: number) => {
      if (!image?.complete || image.naturalWidth === 0) {
        context.fillStyle = '#ff4f87';
        context.beginPath();
        context.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        context.fill();
        return;
      }
      const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
    };

    const drawScene = (time: number) => {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      const background = backgroundRef.current;
      if (background?.complete && background.naturalWidth > 0) {
        const scale = Math.max(WIDTH / background.naturalWidth, HEIGHT / background.naturalHeight);
        const width = background.naturalWidth * scale;
        const height = background.naturalHeight * scale;
        context.drawImage(background, (WIDTH - width) / 2, (HEIGHT - height) / 2, width, height);
      } else {
        context.fillStyle = '#fff1c7';
        context.fillRect(0, 0, WIDTH, HEIGHT);
      }
      const gradient = context.createLinearGradient(0, 0, 0, HEIGHT);
      gradient.addColorStop(0, 'rgba(255,241,199,.36)');
      gradient.addColorStop(1, 'rgba(255,138,168,.48)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, WIDTH, HEIGHT);

      context.fillStyle = 'rgba(93,35,69,.16)';
      context.fillRect(22, 0, WIDTH - 44, HEIGHT);
      context.strokeStyle = 'rgba(255,255,255,.55)';
      context.lineWidth = 5;
      context.setLineDash([24, 22]);
      context.lineDashOffset = (time / 18) % 46;
      context.beginPath();
      context.moveTo(250, 0);
      context.lineTo(250, HEIGHT);
      context.moveTo(470, 0);
      context.lineTo(470, HEIGHT);
      context.stroke();
      context.setLineDash([]);

      obstaclesRef.current.forEach((obstacle) => {
        context.save();
        context.shadowColor = 'rgba(55,16,43,.28)';
        context.shadowBlur = 12;
        drawContained(imagesRef.current[obstacle.sprite], LANES[obstacle.lane], obstacle.y, OBSTACLE_SIZE);
        context.restore();
      });

      context.save();
      context.shadowColor = '#fff';
      context.shadowBlur = 18;
      drawContained(imagesRef.current[playerSpriteRef.current], displayXRef.current, PLAYER_Y, PLAYER_SIZE);
      context.restore();
    };

    const finish = (next: 'lost' | 'won') => {
      changeStatus(next);
      if (next === 'won') {
        localStorage.setItem('arya-dodger-complete', 'true');
        setPreviouslyCompleted(true);
      }
    };

    const update = (delta: number) => {
      displayXRef.current += (LANES[laneRef.current] - displayXRef.current) * Math.min(1, delta * 15);

      spawnTimerRef.current += delta;
      if (spawnTimerRef.current >= 1.05) {
        spawnTimerRef.current -= 1.05;
        const index = obstacleIndexRef.current;
        obstaclesRef.current.push({
          lane: LANE_PATTERN[index % LANE_PATTERN.length],
          y: -70,
          sprite: (index + 2) % SPRITES.length,
          counted: false,
        });
        obstacleIndexRef.current += 1;
      }

      const speed = 225 + Math.min(scoreRef.current * 5, 45);
      obstaclesRef.current.forEach((obstacle) => { obstacle.y += speed * delta; });

      for (const obstacle of obstaclesRef.current) {
        const sameLane = obstacle.lane === laneRef.current;
        const closeEnough = Math.abs(obstacle.y - PLAYER_Y) < 58;
        if (sameLane && closeEnough) {
          finish('lost');
          return;
        }

        if (!obstacle.counted && obstacle.y > PLAYER_Y + 70) {
          obstacle.counted = true;
          scoreRef.current += 1;
          playerSpriteRef.current = scoreRef.current % SPRITES.length;
          setScore(scoreRef.current);
          if (scoreRef.current >= TARGET) {
            finish('won');
            return;
          }
        }
      }

      obstaclesRef.current = obstaclesRef.current.filter((obstacle) => obstacle.y < HEIGHT + 100);
    };

    const loop = (time: number) => {
      const delta = Math.min((time - previousTimeRef.current) / 1000, .032);
      previousTimeRef.current = time;
      if (statusRef.current === 'playing') update(delta || .016);
      drawScene(time);
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [changeStatus]);

  const handleStagePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, a') || statusRef.current !== 'playing') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    move(event.clientX < bounds.left + bounds.width / 2 ? -1 : 1);
  };

  return (
    <section className={styles.gameWrap} aria-label="Face Dodge game">
      <div className={styles.spriteCompanion}><PixelBuddy variant="dude" label="A tiny blue monster cheering from the side" /></div>
      <div className={styles.scoreBar}>
        <span>DODGED <strong>{score}</strong></span>
        <span>TARGET <strong>{TARGET}</strong></span>
        <span>BEST <strong>{previouslyCompleted ? 'CLEARED' : '—'}</strong></span>
      </div>

      <div className={styles.stage} onPointerDown={handleStagePointer}>
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} aria-label="Move left and right to avoid incoming faces" />
        {status !== 'playing' && (
          <div className={styles.overlay}>
            {status === 'ready' && <><span>TAIYAAR?</span><h2>BACHKE REHNA RE BABA!</h2><p>Teen lanes, baarah chehre. Takraayi toh gayi.</p><button type="button" onClick={startGame}>BHAAG ARYA BHAAG</button>{previouslyCompleted && <a className={styles.rewardLink} href="/rewards/face-dodge">VIEW PHOTOS</a>}</>}
            {status === 'lost' && <><span>CAUGHT!</span><h2>TOO MUCH FACE.</h2><p>You dodged {score}. Try switching lanes a little earlier.</p><button type="button" onClick={startGame}>TRY AGAIN</button></>}
            {status === 'won' && <><span>LEVEL CLEARED!</span><h2>KHILKHILAATI HUI YAADEIN UNLOCKED ♡</h2><p>You dodged all 12 incoming faces.</p><a className={styles.rewardLink} href="/rewards/face-dodge">OPEN PHOTOS</a><button type="button" onClick={startGame}>PLAY AGAIN</button></>}
          </div>
        )}
      </div>

      <div className={styles.controls} aria-label="Movement controls">
        <button type="button" onPointerDown={() => move(-1)} aria-label="Move left">← LEFT</button>
        <button type="button" onPointerDown={() => move(1)} aria-label="Move right">RIGHT →</button>
      </div>
    </section>
  );
}
