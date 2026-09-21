'use client';

import { useEffect, useState } from 'react';

export function ProgressStatus() {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = [
        localStorage.getItem('arya-flappy-complete'),
        localStorage.getItem('arya-dodger-complete'),
      ].filter((value) => value === 'true').length;
      setCompleted(total);
    };

    update();
    window.addEventListener('pageshow', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('pageshow', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return <p className="progress-label">{completed} / 2 KHILKHILAATI HUI YAADEIN UNLOCKED</p>;
}
