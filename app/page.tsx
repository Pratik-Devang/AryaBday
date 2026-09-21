const levels = [
  { number: '01', title: '???', symbol: '♥' },
  { number: '02', title: '???', symbol: '★' },
  { number: '03', title: '???', symbol: '♪' },
  { number: '04', title: '???', symbol: '✿' },
];

export default function Home() {
  return (
    <main className="birthday-shell">
      <div className="pixel-sparkle sparkle-one" aria-hidden="true">+</div>
      <div className="pixel-sparkle sparkle-two" aria-hidden="true">✦</div>
      <div className="pixel-sparkle sparkle-three" aria-hidden="true">+</div>

      <header className="top-bar" aria-label="Birthday adventure header">
        <div className="brand-mark" aria-hidden="true"><span>♥</span></div>
        <p>ARYA.EXE</p>
        <div className="top-status">
          <span className="status-dot" aria-hidden="true" />
          BIRTHDAY MODE
        </div>
      </header>

      <section className="hero-panel" aria-labelledby="birthday-title">
        <div className="hero-copy">
          <p className="eyebrow">PLAYER 1, ARE YOU READY?</p>
          <h1 id="birthday-title">HAPPY<span>BIRTHDAY</span>ARYA!</h1>
          <p className="intro">
            A tiny adventure made just for you. Complete each level, collect
            the memories, and unlock your birthday surprise.
          </p>
          <a className="start-button" href="#levels"><span aria-hidden="true">▶</span>PRESS START</a>
        </div>

        <div className="game-window" aria-label="Birthday loading panel">
          <div className="window-bar">
            <span>♡ BIRTHDAY QUEST</span>
            <div className="window-controls" aria-hidden="true"><span>—</span><span>×</span></div>
          </div>
          <div className="window-screen">
            <div className="pixel-heart" aria-hidden="true">
              <span className="heart-row row-one" />
              <span className="heart-row row-two" />
              <span className="heart-row row-three" />
              <span className="heart-row row-four" />
              <span className="heart-row row-five" />
            </div>
            <p>LOADING BEST DAY EVER...</p>
            <div className="load-track" aria-label="Birthday adventure loaded"><span /></div>
            <small>100% READY</small>
          </div>
        </div>
      </section>

      <section className="levels-section" id="levels" aria-labelledby="levels-title">
        <div className="section-heading">
          <div><p className="eyebrow">YOUR ADVENTURE</p><h2 id="levels-title">CHOOSE A LEVEL</h2></div>
          <p className="progress-label">0 / 4 MEMORIES UNLOCKED</p>
        </div>
        <div className="level-grid">
          {levels.map((level) => (
            <article className="level-card" key={level.number} aria-label={`Level ${level.number}, locked`}>
              <div className="level-topline"><span>LEVEL {level.number}</span><span className="lock" aria-hidden="true">▣</span></div>
              <div className="level-symbol" aria-hidden="true">{level.symbol}</div>
              <h3>{level.title}</h3><p>LOCKED</p>
            </article>
          ))}
        </div>
        <p className="coming-soon">More levels are being prepared with love ♡</p>
      </section>

      <footer><span>© MADE FOR ARYA</span><span>WITH MANY, MANY HEARTS ♥</span></footer>
    </main>
  );
}
