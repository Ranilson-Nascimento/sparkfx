
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, findNodeHandle } from 'react-native';

type TargetHandle = number | null;
type TargetMap = Map<string, TargetHandle>;

type Ctx = {
  registerTarget: (name: string, refOrHandle: React.RefObject<any> | number | null) => void;
  unregisterTarget: (name: string) => void;
  getTargetHandle: (name: string) => TargetHandle;
  mountOverlay: (node: React.ReactNode) => string;
  unmountOverlay: (id: string) => void;
};

const CtxObj = createContext<Ctx | null>(null);

export const FXProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const targetsRef = useRef<TargetMap>(new Map());
  const [nodes, setNodes] = useState<{ id: string; node: React.ReactNode }[]>([]);

  const registerTarget = useCallback((name: string, refOrHandle: React.RefObject<any> | number | null) => {
    let handle: TargetHandle = null;
    if (typeof refOrHandle === 'number') {
      handle = refOrHandle;
    } else if (refOrHandle && 'current' in refOrHandle) {
      handle = refOrHandle.current ? findNodeHandle(refOrHandle.current) : null;
    }
    if (handle === null) {
      targetsRef.current.delete(name);
    } else {
      targetsRef.current.set(name, handle);
    }
  }, []);

  const unregisterTarget = useCallback((name: string) => {
    targetsRef.current.delete(name);
  }, []);

  const getTargetHandle = useCallback((name: string) => {
    return targetsRef.current.get(name) ?? null;
  }, []);

  const mountOverlay = useCallback((node: React.ReactNode) => {
    const id = Math.random().toString(36).slice(2);
    setNodes((prev: { id: string; node: React.ReactNode }[]) => [...prev, { id, node }]);
    return id;
  }, []);

  const unmountOverlay = useCallback((id: string) => {
    setNodes((prev: { id: string; node: React.ReactNode }[]) => prev.filter((x: { id: string; node: React.ReactNode }) => x.id !== id));
  }, []);

  const api = useMemo<Ctx>(() => ({
    registerTarget,
    unregisterTarget,
    getTargetHandle,
    mountOverlay,
    unmountOverlay
  }), [getTargetHandle, mountOverlay, registerTarget, unregisterTarget, unmountOverlay]);

  return (
    <CtxObj.Provider value={api}>
      <View style={{ flex: 1 }}>{children}</View>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {nodes.map(n => <React.Fragment key={n.id}>{n.node}</React.Fragment>)}
      </View>
    </CtxObj.Provider>
  );
};

export function useFX(){ const c = useContext(CtxObj); if(!c) throw new Error('FXProvider ausente'); return c; }
