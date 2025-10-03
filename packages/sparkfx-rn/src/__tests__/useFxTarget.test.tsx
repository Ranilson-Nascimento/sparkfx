/** @jsxRuntime classic */
import React, { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';

vi.mock('react-native', () => ({
  __esModule: true,
  View: React.forwardRef<any, any>(({ children, onLayout, ...rest }, ref) => {
    if (typeof onLayout === 'function') {
      // simula o callback automaticamente ao montar
      queueMicrotask(() => onLayout({ nativeEvent: { target: 123 } }));
    }
    return React.createElement('div', { ...rest, ref }, children);
  }),
  StyleSheet: {
    absoluteFill: {},
    absoluteFillObject: {}
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

import { FXProvider, useFX } from '../FXContext';
import { View } from 'react-native';
import { useFxTarget } from '../useFxTarget';

describe('useFxTarget', () => {
  it('registra e remove o target automaticamente', async () => {
    let fxRef: ReturnType<typeof useFX> | null = null;

    const Probe: React.FC = () => {
      const bind = useFxTarget('cart');
      const fx = useFX();

      useEffect(() => {
        fxRef = fx;
      }, [fx]);

      return <View data-testid="probe" {...bind} />;
    };

    const { unmount } = render(
      <FXProvider>
        <Probe />
      </FXProvider>
    );

    await waitFor(() => {
      expect(fxRef?.getTargetHandle('cart')).toBe(123);
    });

    unmount();

    await waitFor(() => {
      expect(fxRef?.getTargetHandle('cart')).toBeNull();
    });
  });
});
