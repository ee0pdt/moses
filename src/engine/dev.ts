/**
 * Development switches, read from the URL:
 *   ?speed=4   run the film four times faster
 *   ?auto      answer every touch prompt automatically (for smoke tests)
 */
const q = new URLSearchParams(location.search);

export const DEV = {
  speed: Math.max(.1, Number(q.get('speed')) || 1),
  auto: q.has('auto'),
};
