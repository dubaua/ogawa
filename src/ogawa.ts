import mergeOptions, { MergeOptionsResult } from '@dubaua/merge-options';
import Observable from '@dubaua/observable';
import { AnimateOptions, Direction, Directions } from './types';
import { ANIMATE_OPTION_CONFIG } from './options';

/** @public Animation helper that drives a progress value with RAF. */
export class Ogawa {
  private options: MergeOptionsResult<AnimateOptions>;
  private lastTimestamp = performance.now();
  private progress = 0;
  private delayBuffer = 0;
  private requestId: number | null = null;
  private _isRunning = new Observable<boolean>(false);
  private direction: Direction = Directions.Forward;
  private _isComplete = false;

  /** Create a new animation with user-provided options. */
  constructor(userOptions: AnimateOptions) {
    this.options = mergeOptions({
      optionConfig: ANIMATE_OPTION_CONFIG,
      userOptions,
      prefix: '[animate]:',
    });

    this._isRunning.subscribe(this.onIsRunningChange);

    if (this.options.autoStart) {
      this.run();
    }
  }

  /** Start forward playback from the current progress. */
  public run() {
    this.direction = Directions.Forward;
    this._isRunning.value = true;
    return this;
  }

  /** Start backward playback from the current progress. */
  public runReverse() {
    this.direction = Directions.Backward;
    this._isRunning.value = true;
    return this;
  }

  /** Stop and reset progress to 0, calling `draw(0)`. */
  public reset() {
    this.progress = 0;
    this.delayBuffer = 0;
    this._isRunning.value = false;

    if (this.requestId !== null) {
      window.cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    this.options.draw(this.progress);
    return this;
  }

  /** Pause without resetting progress. */
  public pause() {
    this._isRunning.value = false;
    return this;
  }

  /** Cancel RAF and drop subscriptions. */
  public destroy() {
    if (this.requestId !== null) {
      window.cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    this._isRunning.reset();
    return this;
  }

  /** True after reaching the end when playing forward. */
  public get isComplete(): boolean {
    return this._isComplete;
  }

  /** True while RAF loop is scheduled. */
  public get isRunning(): boolean {
    return this._isRunning.value;
  }

  private tick = (timestamp: number) => {
    const timeDelta = timestamp - this.lastTimestamp;
    const frameTick = (timeDelta / this.options.duration) * this.direction;

    if (this.delayBuffer < this.options.delay) {
      this.delayBuffer += timeDelta;
    } else {
      this.progress = Math.min(1, Math.max(0, this.progress + frameTick));
      this.options.draw(this.progress);
    }

    const reachedEnd = this.direction === Directions.Forward ? this.progress === 1 : this.progress === 0;

    if (reachedEnd) {
      this._isRunning.value = false;
      if (this.direction === Directions.Forward && typeof this.options.onComplete === 'function') {
        this.options.onComplete();
        this._isComplete = true;
      }
    } else {
      this.lastTimestamp = timestamp;
      this.requestId = window.requestAnimationFrame(this.tick);
    }
  };

  private onIsRunningChange = (nextState: boolean) => {
    if (nextState) {
      this.lastTimestamp = performance.now();
      this.requestId = window.requestAnimationFrame(this.tick);
    } else {
      if (typeof this.options.onCancel === 'function' && this.progress !== 1 && this.progress !== 0) {
        this.options.onCancel(this.progress);
      }
      if (this.requestId !== null) {
        window.cancelAnimationFrame(this.requestId);
      }
    }
  };
}

export type { AnimateOptions, Direction } from './types';
export { Directions };
