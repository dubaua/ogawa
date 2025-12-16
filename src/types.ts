/** @public Animation configuration options. */
export type AnimateOptions = {
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

/** @public Direction constants for forward/backward playback. */
export const Directions = {
  Forward: 1,
  Backward: -1,
} as const;

/** @public Numeric direction union (1 forward, -1 backward). */
export type Direction = (typeof Directions)[keyof typeof Directions];
