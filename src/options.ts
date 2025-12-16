import { OptionConfig } from '@dubaua/merge-options';
import { AnimateOptions } from './types';

export const ANIMATE_OPTION_CONFIG: OptionConfig<AnimateOptions> = {
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
  autoStart: {
    required: false,
    default: true,
    validator: (x) => typeof x === 'boolean',
    description: 'a boolean',
  },
};
