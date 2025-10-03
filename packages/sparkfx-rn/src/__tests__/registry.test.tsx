import React from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  __esModule: true,
  Pressable: ({ children, ...rest }: any) => React.createElement('pressable', rest, children),
  View: ({ children, ...rest }: any) => React.createElement('view', rest, children),
  Text: ({ children, ...rest }: any) => React.createElement('text', rest, children),
  StyleSheet: {
    create: (styles: any) => styles,
    absoluteFill: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
    absoluteFillObject: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }
  },
  UIManager: {
    measure: (_handle: number, callback: Function) => callback(0, 0, 100, 100, 0, 0)
  },
  findNodeHandle: () => 1
}));

vi.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    createAnimatedComponent: (Comp: any) => Comp
  },
  useSharedValue: (initial: any) => ({ value: initial }),
  useAnimatedStyle: () => ({}),
  withSpring: (value: any) => value,
  withTiming: (value: any) => value,
  Easing: { inOut: () => () => ({}) },
  runOnJS: (fn: any) => fn
}));

const leaf = React.createElement('button', { id: 'cta' });

let applyFx: typeof import('../registry')['applyFx'];
let BounceWrap: any;
let RippleWrap: any;
let ShakeWrap: any;
let ToastWrap: any;

beforeAll(async () => {
  ({ applyFx } = await import('../registry'));
  ({ BounceWrap, RippleWrap, ShakeWrap, ToastWrap } = await import('../effects'));
});

describe('applyFx', () => {
  it('encadeia os wrappers na ordem declarada', () => {
    const result = applyFx(leaf, 'bounce(s=0.9)|ripple(r=120)|toast(text="Feito")');
    expect(result.type).toBe(ToastWrap);
    const rippleNode = result.props.children as React.ReactElement;
    expect(rippleNode.type).toBe(RippleWrap);
    const bounceNode = rippleNode.props.children as React.ReactElement;
    expect(bounceNode.type).toBe(BounceWrap);
  });

  it('ignora efeitos desconhecidos', () => {
    const result = applyFx(leaf, 'desconhecido|shake');
    expect(result.type).toBe(ShakeWrap);
  });
});
