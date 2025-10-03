import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useFX } from './FXContext';

function assignRef<T>(ref: React.Ref<T> | undefined | null, value: T) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  try {
    (ref as React.MutableRefObject<T>).current = value;
  } catch (err) {
    // ignore assignment errors (read-only refs)
  }
}

function mergeRefs<T>(refs: (React.Ref<T> | undefined | null)[]): React.RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => assignRef(ref, value));
  };
}

type Props = {
  name: string;
  element: React.ReactElement;
  originalRef: React.Ref<any> | null;
};

export function FXTargetBoundary(props: Props): React.ReactElement {
  const { name, element, originalRef } = props;
  const fx = useFX();
  const hostRef = useRef<any>(null);
  const childRef = (element as any)?.ref as React.Ref<any> | undefined;

  const mergedRef = useMemo(() => mergeRefs([originalRef, childRef, hostRef]), [childRef, originalRef]);
  const childOnLayout = element.props?.onLayout as ((event: LayoutChangeEvent) => void) | undefined;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const targetHandle = (event?.nativeEvent as any)?.target ?? null;
    fx.registerTarget(name, targetHandle ?? hostRef);
    if (childOnLayout) {
      childOnLayout(event);
    }
  }, [childOnLayout, fx, name]);

  useEffect(() => {
    if (hostRef.current) {
      fx.registerTarget(name, hostRef);
    }
    return () => fx.unregisterTarget(name);
  }, [fx, name]);

  return React.cloneElement(element, {
    ref: mergedRef,
    onLayout: handleLayout
  });
}
