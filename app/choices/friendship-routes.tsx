'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PixelBuddy } from '../pixel-buddy';
import styles from './friendship-routes.module.css';

type RegularRoute = 'manasvi' | 'aditya' | 'nikhil' | 'sharanya';
type Route = RegularRoute | 'pratik';
type View = 'intro' | 'quiz' | 'result' | 'routes';

type ModelContext = {
  registerTool: (tool: {
    name: string;
    title: string;
    description: string;
    inputSchema: object;
    annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
    execute: () => { status: string };
  }, options: { signal: AbortSignal }) => void | Promise<void>;
};

const routeInfo: Record<Route, { name: string; label: string; symbol: string }> = {
  manasvi: { name: 'Manasvi', label: 'The Calm Comeback Route', symbol: '✦' },
  aditya: { name: 'Aditya', label: 'The Dependable Route', symbol: '☾' },
  nikhil: { name: 'Nikhil', label: 'The Competitive Roast Route', symbol: '⚡' },
  sharanya: { name: 'Sharanya', label: 'The Caring Chaos Route', symbol: '★' },
  pratik: { name: 'Pratik', label: 'The Final Route', symbol: '♥' },
};

const routeVideos: Partial<Record<Route, string>> = {
  manasvi: '/videos/manasvi.mp4',
  aditya: '/videos/aditya.mp4',
  nikhil: '/videos/nikhil.mp4',
  sharanya: '/videos/sharanya.mp4',
};

const questions: Array<{ prompt: string; scene: string; answers: Array<{ text: string; route: RegularRoute }> }> = [
  {
    scene: 'THE PLAN DISAPPEARS',
    prompt: 'The entire plan gets cancelled at the last minute. What now?',
    answers: [
      { text: 'Reply much later with “oh, that got cancelled?” and move on.', route: 'manasvi' },
      { text: 'Suggest one sensible backup plan and make sure everyone is okay with it.', route: 'aditya' },
      { text: 'Give a brutally honest review of the planning, then suggest food.', route: 'nikhil' },
      { text: 'Start discussing three new plans at once until one somehow works.', route: 'sharanya' },
    ],
  },
  {
    scene: 'SHE HAS GONE QUIET',
    prompt: 'Arya is unusually quiet in the middle of a hangout. What do you do?',
    answers: [
      { text: 'Notice it, stay calm, and make one dry comment that gets a laugh.', route: 'manasvi' },
      { text: 'Check on her privately and ask what she actually needs.', route: 'aditya' },
      { text: 'Offer one blunt opinion, then quietly bring her something to eat.', route: 'nikhil' },
      { text: 'Notice immediately, keep her company, and gently pull her back in.', route: 'sharanya' },
    ],
  },
  {
    scene: 'GAME NIGHT',
    prompt: 'A harmless game suddenly gets very competitive. Who are you becoming?',
    answers: [
      { text: 'Mostly laughing, occasionally landing a perfect comeback.', route: 'manasvi' },
      { text: 'Quietly understanding the rules and helping everyone else play.', route: 'aditya' },
      { text: 'Winning is now a matter of personal honour. No mercy.', route: 'nikhil' },
      { text: 'Talking through every move and turning the room into a performance.', route: 'sharanya' },
    ],
  },
  {
    scene: 'MINOR CRISIS',
    prompt: 'Something has gone wrong, but nobody is in actual danger. Your role?',
    answers: [
      { text: 'Stay completely unbothered and remind everyone this has happened before.', route: 'manasvi' },
      { text: 'Take over the practical problem and tell everyone exactly what to do.', route: 'aditya' },
      { text: 'Stay calm, state the obvious truth nobody wanted to hear, and fix it.', route: 'nikhil' },
      { text: 'Check on everyone first, then improvise a surprisingly effective solution.', route: 'sharanya' },
    ],
  },
  {
    scene: 'GROUP CHAT CHAOS',
    prompt: 'There are 86 unread messages and nothing makes sense. What do you send?',
    answers: [
      { text: 'Reply late with one blunt line—and somehow make it funny.', route: 'manasvi' },
      { text: 'Send a meme, then answer the one message that genuinely needs help.', route: 'aditya' },
      { text: 'Drop an unfiltered opinion and immediately create a new argument.', route: 'nikhil' },
      { text: 'Send twelve messages, a voice note, and a completely unrelated photo.', route: 'sharanya' },
    ],
  },
  {
    scene: 'A TINY SURPRISE',
    prompt: 'You want to do something small for Arya without making it a big event.',
    answers: [
      { text: 'Remember a tiny detail she mentioned ages ago and casually use it.', route: 'manasvi' },
      { text: 'Bring something thoughtful and pretend it was no trouble at all.', route: 'aditya' },
      { text: 'Bring food, hand it over, and act like there is no emotional meaning.', route: 'nikhil' },
      { text: 'Bring something she likes, take photos, and make the moment unexpectedly loud.', route: 'sharanya' },
    ],
  },
];

const regularRoutes: RegularRoute[] = ['manasvi', 'aditya', 'nikhil', 'sharanya'];

export function FriendshipRoutes() {
  const [view, setView] = useState<View>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [result, setResult] = useState<Route | null>(null);
  const [unlocked, setUnlocked] = useState<RegularRoute[]>([]);
  const scoresRef = useRef<Record<RegularRoute, number>>({ manasvi: 0, aditya: 0, nikhil: 0, sharanya: 0 });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('arya-friend-routes') ?? '[]') as RegularRoute[];
      setUnlocked(saved.filter((route) => regularRoutes.includes(route)));
    } catch {
      setUnlocked([]);
    }
  }, []);

  const startQuiz = useCallback(() => {
    scoresRef.current = { manasvi: 0, aditya: 0, nikhil: 0, sharanya: 0 };
    setQuestionIndex(0);
    setResult(null);
    setView('quiz');
  }, []);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'start_friendship_routes',
      title: 'Start Friendship Routes',
      description: 'Open a fresh Friendship Routes quiz and reset the current unanswered run.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: () => {
        startQuiz();
        return { status: 'started' };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [startQuiz]);

  const chooseAnswer = (route: RegularRoute) => {
    const nextScores = { ...scoresRef.current, [route]: scoresRef.current[route] + 1 };
    scoresRef.current = nextScores;

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    const highest = Math.max(...Object.values(nextScores));
    const tied = regularRoutes.filter((candidate) => nextScores[candidate] === highest);
    const winner = tied.includes(route) ? route : tied[0];
    const nextUnlocked = Array.from(new Set([...unlocked, winner]));
    setUnlocked(nextUnlocked);
    localStorage.setItem('arya-friend-routes', JSON.stringify(nextUnlocked));
    setResult(winner);
    setView('result');
  };

  const openRoute = (route: Route) => {
    if (route === 'pratik' && unlocked.length < 4) return;
    if (route !== 'pratik' && !unlocked.includes(route)) return;
    setResult(route);
    setView('result');
  };

  const finalUnlocked = unlocked.length === 4;
  const currentQuestion = questions[questionIndex];

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <Link href="/">← HOME</Link>
        <span>FRIENDSHIP_ROUTES.EXE</span>
        <button type="button" onClick={() => setView('routes')}>{unlocked.length} / 4 FOUND</button>
      </header>

      {view === 'intro' && (
        <section className={styles.introPanel}>
          <p className={styles.eyebrow}>FIVE PEOPLE. FIVE ENDINGS.</p>
          <h1>WHERE WILL<br />YOUR CHOICES<br /><span>LEAD YOU?</span></h1>
          <p>Choose what feels right. One friend—and one message—is waiting at the end of every route.</p>
          <div className={styles.spriteCrew} aria-hidden="true">
            <PixelBuddy variant="pink" />
            <PixelBuddy variant="owlet" />
            <PixelBuddy variant="dude" />
          </div>
          <div className={styles.introActions}>
            <button type="button" onClick={startQuiz}>START A ROUTE</button>
            <button type="button" className={styles.secondary} onClick={() => setView('routes')}>VIEW ROUTES</button>
          </div>
        </section>
      )}

      {view === 'quiz' && (
        <section className={styles.quizPanel}>
          <div className={styles.quizProgress}>
            <span>SCENE {String(questionIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</span>
            <div><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
          </div>
          <p className={styles.sceneLabel}>{currentQuestion.scene}</p>
          <h2>{currentQuestion.prompt}</h2>
          <div className={styles.answers}>
            {currentQuestion.answers.map((answer, index) => (
              <button type="button" key={answer.text} onClick={() => chooseAnswer(answer.route)}>
                <span>{String.fromCharCode(65 + index)}</span>{answer.text}
              </button>
            ))}
          </div>
        </section>
      )}

      {view === 'result' && result && (
        <section className={styles.resultPanel}>
          <span className={styles.resultSymbol}>{routeInfo[result].symbol}</span>
          <p className={styles.eyebrow}>{result === 'pratik' ? 'ALL ROUTES COMPLETE' : 'NEW ROUTE DISCOVERED'}</p>
          <h2>YOU FOUND<br /><strong>{routeInfo[result].name.toUpperCase()}</strong></h2>
          <p className={styles.routeLabel}>{routeInfo[result].label}</p>
          <div className={styles.videoSlot}>
            {routeVideos[result] ? (
              <video key={result} controls playsInline preload="metadata" aria-label={`Video message from ${routeInfo[result].name}`}>
                <source src={routeVideos[result]} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            ) : (
              <>
                <span>▶</span>
                <p>A VIDEO MESSAGE IS WAITING HERE</p>
              </>
            )}
          </div>
          <div className={styles.resultActions}>
            {result !== 'pratik' && <button type="button" onClick={startQuiz}>TRY ANOTHER ROUTE</button>}
            <button type="button" className={styles.secondary} onClick={() => setView('routes')}>ALL ROUTES</button>
          </div>
        </section>
      )}

      {view === 'routes' && (
        <section className={styles.routesPanel}>
          <div className={styles.routesHeading}>
            <p className={styles.eyebrow}>MESSAGE ARCHIVE</p>
            <h2>DISCOVERED ROUTES</h2>
            <p>Replay the story with different choices to find everyone.</p>
          </div>
          <div className={styles.routeGrid}>
            {regularRoutes.map((route) => {
              const isUnlocked = unlocked.includes(route);
              return (
                <button type="button" key={route} disabled={!isUnlocked} onClick={() => openRoute(route)} className={isUnlocked ? styles.unlockedRoute : ''}>
                  <span>{isUnlocked ? routeInfo[route].symbol : '?'}</span>
                  <small>{isUnlocked ? 'UNLOCKED' : 'LOCKED'}</small>
                  <strong>{isUnlocked ? routeInfo[route].name : '???'}</strong>
                </button>
              );
            })}
            <button type="button" disabled={!finalUnlocked} onClick={() => openRoute('pratik')} className={`${styles.finalRoute} ${finalUnlocked ? styles.unlockedRoute : ''}`}>
              <span>{finalUnlocked ? routeInfo.pratik.symbol : '♥'}</span>
              <small>{finalUnlocked ? 'FINAL ROUTE UNLOCKED' : 'FIND ALL FOUR ROUTES'}</small>
              <strong>{finalUnlocked ? 'PRATIK' : 'ONE MESSAGE REMAINS'}</strong>
            </button>
          </div>
          <button type="button" className={styles.playAgain} onClick={startQuiz}>START A NEW ROUTE</button>
        </section>
      )}
    </main>
  );
}
