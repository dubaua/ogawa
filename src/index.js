import mergeOptions from '@dubaua/merge-options';
import Observable from '@dubaua/observable';

const ANIMATE_OPTION_CONFIG = {
  duration: {
    required: true,
    validator: (x) => typeof x === 'number' && x > 0,
    description: 'a positive number of milliseconds',
  },
  delay: {
    required: false,
    default: 0,
    validator: (x) => typeof x === 'number' && x >= 0,
    description: 'a non-negative number of milliseconds',
  },
  easing: {
    required: true,
    validator: (x) => typeof x === 'function',
    description: 'a function',
  },
  draw: {
    required: true,
    validator: (x) => typeof x === 'function',
    description: 'a function',
  },
  onComplete: {
    required: false,
    default: undefined,
    validator: (x) => typeof x === 'function' || x === undefined,
    description: 'a function',
  },
  onCancel: {
    required: false,
    default: undefined,
    validator: (x) => typeof x === 'function' || x === undefined,
    description: 'a function',
  },
};

function animate(userOptions = {}) {
  const { duration, delay, easing, draw, onComplete, onCancel } = mergeOptions({
    optionConfig: ANIMATE_OPTION_CONFIG,
    userOptions,
    prefix: '[animate]:',
  });

  let lastTimestamp = performance.now();
  let progress = 0;
  let fraction = 0;
  let delayBuffer = 0;
  let requestId = null;

  const isRunning = new Observable(false);
  isRunning.subscribe(onIsRunningChange);
  isRunning.value = true;

  function tick(timestamp) {
    const timedelta = timestamp - lastTimestamp;
    const frametick = timedelta / duration;

    if (delayBuffer < delay) {
      delayBuffer += timedelta;
    } else {
      fraction = Math.min(1, Math.max(0, fraction + frametick));
      progress = easing(fraction);
      draw(progress);
    }

    if (fraction === 1) {
      isRunning.value = false;
      if (typeof onComplete === 'function') {
        onComplete();
      }
    } else {
      lastTimestamp = timestamp;
      requestId = window.requestAnimationFrame(tick);
    }
  }

  function onIsRunningChange(nextState) {
    if (nextState) {
      lastTimestamp = performance.now();
      requestId = window.requestAnimationFrame(tick);
    } else {
      if (typeof onCancel === 'function' && progress !== 1 && progress !== 0) {
        onCancel({ progress, fraction });
      }
      window.cancelAnimationFrame(requestId);
    }
  }

  function togglePause(force) {
    isRunning.value = force === undefined ? !isRunning.value : force;
  }

  return { togglePause };
}
