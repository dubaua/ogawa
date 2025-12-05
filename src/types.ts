export type AnimateOptions = {
  duration: number;
  delay?: number;
  draw: (progress: number) => void;
  onComplete?: () => void;
  onCancel?: (progress: number) => void;
};
