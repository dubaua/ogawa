# Changelog

## 0.1.0

- Added `reset()` to clear progress and delay, stop RAF, and call `draw(0)`.
- Added `destroy()` to cancel any pending `requestAnimationFrame` and clear observable subscriptions.
- Added `autoStart` flag (default `true`) to start the animation automatically after instantiation.
- Documented control methods `run()`, `runReverse()`, and `pause()` for forward/backward playback and stopping.
- Documented getters `isRunning` and `isComplete` to track playback state.
