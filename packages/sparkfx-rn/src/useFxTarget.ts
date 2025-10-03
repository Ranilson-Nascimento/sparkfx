import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useFX } from './FXContext';

type UseFxTargetReturn = {
  ref: React.RefObject<any>;
  onLayout: (event: LayoutChangeEvent) => void;
};

export function useFxTarget(name: string): UseFxTargetReturn {
  const fx = useFX();
  const hostRef = useRef<any>(null);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
  const handle = (event?.nativeEvent as any)?.target ?? null;
    fx.registerTarget(name, handle ?? hostRef);
  }, [fx, name]);

  useEffect(() => {
    fx.registerTarget(name, hostRef);
    return () => fx.unregisterTarget(name);
  }, [fx, name]);

  return useMemo(() => ({
    ref: hostRef,
    onLayout: handleLayout
  }), [handleLayout]);
}
