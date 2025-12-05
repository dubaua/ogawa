import mergeOptions, { OptionConfig } from '@dubaua/merge-options';
import Observable from '@dubaua/observable';
import { AnimateOptions } from './types';
import { ANIMATE_OPTION_CONFIG } from './options';

function animate(userOptions: AnimateOptions) {
  const { duration, delay, draw, onComplete, onCancel } = mergeOptions({
    optionConfig: ANIMATE_OPTION_CONFIG,
    userOptions,
    prefix: '[animate]:',
  });

  let lastTimestamp = performance.now();
  let progress = 0;
  let delayBuffer = 0;
  let requestId: number | null = null;

  const isRunning = new Observable<boolean>(false);
  isRunning.subscribe(onIsRunningChange);
  isRunning.value = true;

  function tick(timestamp: number) {
    const timeDelta = timestamp - lastTimestamp;
    const frameTick = timeDelta / duration;

    if (delayBuffer < delay) {
      delayBuffer += timeDelta;
    } else {
      progress = Math.min(1, Math.max(0, progress + frameTick));
      draw(progress);
    }

    if (progress === 1) {
      isRunning.value = false;
      if (typeof onComplete === 'function') {
        onComplete();
      }
    } else {
      lastTimestamp = timestamp;
      requestId = window.requestAnimationFrame(tick);
    }
  }

  function onIsRunningChange(nextState: boolean) {
    if (nextState) {
      lastTimestamp = performance.now();
      requestId = window.requestAnimationFrame(tick);
    } else {
      if (typeof onCancel === 'function' && progress !== 1 && progress !== 0) {
        onCancel(progress);
      }
      if (requestId !== null) {
        window.cancelAnimationFrame(requestId);
      }
    }
  }

  function togglePause(force?: boolean) {
    isRunning.value = force === undefined ? !isRunning.value : force;
  }

  return { togglePause };
}

export default animate;
