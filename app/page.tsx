import { MotionController } from './motion-controller';
import { PixelBuddy } from './pixel-buddy';
import { ProgressStatus } from './progress-status';

const levels = [
  { number: '01', title: 'CHADDAR PARINDA', symbol: '↑', href: '/games/flappy' },
  { number: '02', title: 'FACE DODGE', symbol: '↔', href: '/games/dodger' },
];

export default function Home() {
  return (
    <main className="birthday-shell">
      <MotionController />
      <div className="pixel-sparkle sparkle-one" aria-hidden="true">+</div>
      <div className="pixel-sparkle sparkle-two" aria-hidden="true">✦</div>
      <div className="pixel-sparkle sparkle-three" aria-hidden="true">+</div>

      <header className="top-bar intro-animate intro-one" aria-label="Birthday adventure header">
        <div className="brand-mark" aria-hidden="true"><span>♥</span></div>
        <p>ARYA.EXE</p>
        <div className="top-status">
          <span className="status-dot" aria-hidden="true" />
          BIRTHDAY MODE
        </div>
      </header>

      <section className="hero-panel" aria-labelledby="birthday-title">
        <div className="hero-copy intro-animate intro-two">
          <p className="eyebrow">PLAYER 1, ARE YOU READY?</p>
          <h1 id="birthday-title">HAPPY<span>BIRTHDAY</span>ARYA!</h1>
          <p className="intro">
            A tiny adventure made just for you. Complete each level, collect
            khilkhilaati hui yaadein, and unlock your birthday surprise.
          </p>
          <a className="start-button" href="#levels"><span aria-hidden="true">▶</span>PRESS START</a>
        </div>

        <div className="game-window intro-animate intro-three" aria-label="Birthday loading panel">
          <div className="window-bar">
            <span>♡ BIRTHDAY QUEST</span>
            <div className="window-controls" aria-hidden="true"><span>—</span><span>×</span></div>
          </div>
          <div className="window-screen">
            <div className="pink-mascot" role="img" aria-label="A tiny pink monster waving hello" />
            <p>LOADING BEST DAY EVER...</p>
            <div className="load-track" aria-label="Birthday adventure loaded"><span /></div>
            <small>100% READY</small>
          </div>
        </div>
      </section>

      <section className="levels-section" id="levels" aria-labelledby="levels-title">
        <div className="section-heading scroll-reveal reveal-up">
          <div><p className="eyebrow">YOUR ADVENTURE</p><h2 id="levels-title">CHOOSE A LEVEL</h2></div>
          <ProgressStatus />
        </div>
        <div className="level-grid">
          {levels.map((level) => {
            const card = (
              <>
                <div className="level-topline"><span>LEVEL {level.number}</span><span className="lock" aria-hidden="true">{level.href ? '▶' : '▣'}</span></div>
                <div className="level-symbol" aria-hidden="true">{level.symbol}</div>
                <h3>{level.title}</h3><p>{level.href ? 'PLAY NOW' : 'LOCKED'}</p>
              </>
            );

            return level.href ? (
              <a className="level-card level-card-playable scroll-reveal reveal-up" href={level.href} key={level.number} aria-label={`Play level ${level.number}: ${level.title}`}>
                {card}
              </a>
            ) : (
              <article className="level-card scroll-reveal reveal-up" key={level.number} aria-label={`Level ${level.number}, locked`}>
                {card}
              </article>
            );
          })}
        </div>
        <p className="coming-soon scroll-reveal reveal-up">Clear both games to unlock khilkhilaati hui yaadein ♡</p>
      </section>

      <section className="routes-teaser scroll-reveal reveal-up" aria-labelledby="routes-teaser-title">
        <div>
          <p className="eyebrow">A DIFFERENT KIND OF ADVENTURE</p>
          <h2 id="routes-teaser-title">FRIENDSHIP ROUTES</h2>
          <p>Six choices. Four hidden routes. One final message waiting at the end.</p>
        </div>
        <div className="routes-teaser-panel">
          <div className="routes-teaser-sprites" aria-hidden="true">
            <PixelBuddy variant="pink" />
            <PixelBuddy variant="owlet" />
            <PixelBuddy variant="dude" />
          </div>
          <p>4 ROUTES + 1 FINAL</p>
          <a href="/choices">ENTER THE STORY <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <footer className="scroll-reveal reveal-up"><span>© MADE FOR ARYA</span><span>WITH MANY, MANY HEARTS ♥</span></footer>
    </main>
  );
}
