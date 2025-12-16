/** @public Animation configuration options. */
export declare type AnimateOptions = {
    /** Animation length in milliseconds. */
    duration: number;
    /** Delay before the first frame, in milliseconds. */
    delay?: number;
    /** Called on each frame with progress 0..1. */
    draw: (progress: number) => void;
    /** Called when reaching 1 while playing forward. */
    onComplete?: () => void;
    /** Called when paused/stopped before completion with current progress. */
    onCancel?: (progress: number) => void;
    /** Start immediately after construction; defaults to true. */
    autoStart?: boolean;
};

/** @public Numeric direction union (1 forward, -1 backward). */
export declare type Direction = (typeof Directions)[keyof typeof Directions];

/** @public Direction constants for forward/backward playback. */
export declare const Directions: {
    readonly Forward: 1;
    readonly Backward: -1;
};

/** @public Animation helper that drives a progress value with RAF. */
export declare class Ogawa {
    private options;
    private lastTimestamp;
    private progress;
    private delayBuffer;
    private requestId;
    private _isRunning;
    private direction;
    private _isComplete;
    /** Create a new animation with user-provided options. */
    constructor(userOptions: AnimateOptions);
    /** Start forward playback from the current progress. */
    run(): this;
    /** Start backward playback from the current progress. */
    runReverse(): this;
    /** Stop and reset progress to 0, calling `draw(0)`. */
    reset(): this;
    /** Pause without resetting progress. */
    pause(): this;
    /** Cancel RAF and drop subscriptions. */
    destroy(): this;
    /** True after reaching the end when playing forward. */
    get isComplete(): boolean;
    /** True while RAF loop is scheduled. */
    get isRunning(): boolean;
    private tick;
    private onIsRunningChange;
}

export { }
