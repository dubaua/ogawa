# Ogawa Animation

Tiny TypeScript helper to run simple timeline-like animations with a `draw(progress)` callback. It batches updates with `requestAnimationFrame`, supports delays, reverse playback, and exposes lifecycle hooks.

## Install

```shell
npm install ogawa
```

## Quick start

```ts
import Ogawa from 'ogawa';

const animation = new Ogawa({
  duration: 600,
  delay: 100,
  draw: (progress) => {
    // apply progress 0..1 to your UI
    console.log(progress);
  },
  onComplete: () => {
    console.log('done');
  },
  onCancel: (progress) => {
    console.log('stopped at', progress);
  },
  autoStart: false, // if you want not to start animation automatically
});

// control
animation.run(); // forward
animation.runReverse(); // backward
animation.pause(); // halt without reset
animation.reset(); // stop and jump to 0
animation.destroy(); // cancel RAF and clear listeners
```

## Options

| option     | type       | default     | description                                                           |
| ---------- | ---------- | ----------- | --------------------------------------------------------------------- |
| duration   | `number`   | required    | Animation length in ms.                                               |
| delay      | `number`   | `0`         | Delay before the first frame.                                         |
| draw       | `function` | required    | Called on each frame with `progress` in `0..1`.                       |
| onComplete | `function` | `undefined` | Called after reaching `1` when playing forward.                       |
| onCancel   | `function` | `undefined` | Called when paused/stopped before completion with current `progress`. |
| autoStart  | `boolean`  | `true`      | Start immediately after construction.                                 |
