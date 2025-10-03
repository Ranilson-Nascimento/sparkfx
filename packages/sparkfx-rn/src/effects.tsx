
import React, { useEffect, useMemo, useRef } from 'react';
import { View, Pressable, StyleSheet, Text, UIManager, findNodeHandle } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming, withDelay, type SharedValue } from 'react-native-reanimated';
import { useFX } from './FXContext';

type FxArgs = Record<string, any>;
type MeasuredBox = { x: number; y: number; width: number; height: number };

const AnimatedView = Animated.createAnimatedComponent(View);

function ensureElement(child: React.ReactNode): React.ReactElement<any> {
  const element = React.Children.only(child);
  if (!React.isValidElement(element)) {
    throw new Error('sparkfx: efeito requere um elemento React válido.');
  }
  return element;
}

function callHandler(handler: any, event: any) {
  if (typeof handler === 'function') {
    handler(event);
  }
}

function resolveNumber(value: any, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function resolveTarget(args?: FxArgs): string {
  if (!args) return 'cart';
  if (typeof args.to === 'string') return args.to;
  if (typeof args.target === 'string') return args.target;
  const firstString = Object.values(args).find((value) => typeof value === 'string');
  if (typeof firstString === 'string') return firstString;
  const firstTruthy = Object.keys(args).find((key) => args[key] === true);
  return firstTruthy ?? 'cart';
}

const MIN_SIZE = 12;

function sanitizeBox(box: MeasuredBox): MeasuredBox {
  return {
    x: box.x,
    y: box.y,
    width: Math.max(MIN_SIZE, box.width),
    height: Math.max(MIN_SIZE, box.height)
  };
}

async function measureHandle(handle: number | null): Promise<MeasuredBox | null> {
  if (!handle) return null;
  return new Promise((resolve) => {
    try {
  UIManager.measure(handle, (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
        if (typeof pageX !== 'number' || typeof pageY !== 'number') {
          resolve(null);
          return;
        }
        resolve({ x: pageX, y: pageY, width, height });
      });
    } catch (err) {
      resolve(null);
    }
  });
}

export function BounceWrap({ children, s = 0.94 }: { children: React.ReactNode; s?: number }) {
  const child = ensureElement(children);
  const childOnPressIn = child.props?.onPressIn;
  const childOnPressOut = child.props?.onPressOut;
  const childOnPress = child.props?.onPress;

  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
  onPressIn={(event: GestureResponderEvent) => {
        scale.value = withSpring(s, { damping: 20, stiffness: 280 });
        callHandler(childOnPressIn, event);
      }}
  onPressOut={(event: GestureResponderEvent) => {
        scale.value = withSpring(1, { damping: 14, stiffness: 240 });
        callHandler(childOnPressOut, event);
      }}
  onPress={(event: GestureResponderEvent) => {
        callHandler(childOnPress, event);
      }}
    >
      <Animated.View style={style} pointerEvents="box-none">
        {React.cloneElement(child, { onPressIn: undefined, onPressOut: undefined, onPress: undefined })}
      </Animated.View>
    </Pressable>
  );
}

export function RippleWrap({ children, r = 80, op = 0.18 }: { children: React.ReactNode; r?: number; op?: number }) {
  const child = ensureElement(children);
  const childOnPressIn = child.props?.onPressIn;
  const childOnPressOut = child.props?.onPressOut;
  const childOnPress = child.props?.onPress;

  const scale = useSharedValue(0.01);
  const opacity = useSharedValue(0);
  const rippleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));

  return (
    <Pressable
  onPressIn={(event: GestureResponderEvent) => {
        opacity.value = op;
        scale.value = 0.01;
        scale.value = withTiming(1, { duration: 420 });
        opacity.value = withTiming(0, { duration: 450 });
        callHandler(childOnPressIn, event);
      }}
  onPressOut={(event: GestureResponderEvent) => {
        callHandler(childOnPressOut, event);
      }}
  onPress={(event: GestureResponderEvent) => {
        callHandler(childOnPress, event);
      }}
      style={styles.ripplePressable}
    >
      <View pointerEvents="box-none">
        {React.cloneElement(child, { onPressIn: undefined, onPressOut: undefined, onPress: undefined })}
      </View>
      <AnimatedView pointerEvents="none" style={[styles.rippleOverlay, rippleStyle]}>
        <AnimatedView style={[{ width: r * 2, height: r * 2, borderRadius: r }, styles.rippleCircle]} />
      </AnimatedView>
    </Pressable>
  );
}

export function ShakeWrap({ children }: { children: React.ReactNode }) {
  const child = ensureElement(children);
  const childOnPress = child.props?.onPress;
  const x = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const trigger = (event: any) => {
    x.value = withTiming(-4, { duration: 60 }, () => {
      x.value = withTiming(4, { duration: 120 }, () => {
        x.value = withTiming(-3, { duration: 100 }, () => {
          x.value = withTiming(3, { duration: 100 }, () => {
            x.value = withTiming(0, { duration: 80 });
          });
        });
      });
    });
    callHandler(childOnPress, event);
  };

  return (
    <Pressable onPress={trigger}>
      <Animated.View style={style} pointerEvents="box-none">
        {React.cloneElement(child, { onPress: undefined })}
      </Animated.View>
    </Pressable>
  );
}

// New: PressPop (press-in pop then settle)
export function PressPopWrap({ children, s = 1.08 }: { children: React.ReactNode; s?: number }) {
  const child = ensureElement(children);
  const childOnPressIn = child.props?.onPressIn;
  const childOnPressOut = child.props?.onPressOut;
  const childOnPress = child.props?.onPress;

  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPressIn={(event: GestureResponderEvent) => {
        // Quick pop up
        scale.value = withTiming(s, { duration: 90, easing: Easing.out(Easing.cubic) });
        callHandler(childOnPressIn, event);
      }}
      onPressOut={(event: GestureResponderEvent) => {
        // Settle with a subtle overshoot
        scale.value = withSpring(1, { damping: 12, stiffness: 220 });
        callHandler(childOnPressOut, event);
      }}
      onPress={(event: GestureResponderEvent) => {
        callHandler(childOnPress, event);
      }}
    >
      <Animated.View style={style} pointerEvents="box-none">
        {React.cloneElement(child, { onPressIn: undefined, onPressOut: undefined, onPress: undefined })}
      </Animated.View>
    </Pressable>
  );
}

type FlyOverlayProps = {
  element: React.ReactElement;
  start: MeasuredBox;
  end: MeasuredBox;
  duration: number;
  onFinish: () => void;
};

type FlyPath = {
  start: { cx: number; cy: number };
  end: { cx: number; cy: number };
  c1: { cx: number; cy: number };
  c2: { cx: number; cy: number };
  size: { start: { width: number; height: number }; end: { width: number; height: number } };
};

function buildFlyPath(start: MeasuredBox, end: MeasuredBox): FlyPath {
  const sanitizedStart = sanitizeBox(start);
  const sanitizedEnd = sanitizeBox(end);
  const startCenter = {
    cx: sanitizedStart.x + sanitizedStart.width / 2,
    cy: sanitizedStart.y + sanitizedStart.height / 2
  };
  const endCenter = {
    cx: sanitizedEnd.x + sanitizedEnd.width / 2,
    cy: sanitizedEnd.y + sanitizedEnd.height / 2
  };
  const midX = (startCenter.cx + endCenter.cx) / 2;
  const lift = Math.max(72, Math.abs(startCenter.cy - endCenter.cy) * 0.45);
  const peakY = Math.min(startCenter.cy, endCenter.cy) - lift;

  return {
    start: startCenter,
    end: endCenter,
    c1: { cx: startCenter.cx * 0.7 + midX * 0.3, cy: peakY },
    c2: { cx: midX * 0.3 + endCenter.cx * 0.7, cy: peakY - lift * 0.2 },
    size: {
      start: { width: sanitizedStart.width, height: sanitizedStart.height },
      end: { width: sanitizedEnd.width, height: sanitizedEnd.height }
    }
  };
}

const FlyOverlay: React.FC<FlyOverlayProps> = (props: FlyOverlayProps) => {
  const { element, start, end, duration, onFinish } = props;
  const path = useSharedValue<FlyPath>(buildFlyPath(start, end));
  const progress = useSharedValue(0);

  useEffect(() => {
    path.value = buildFlyPath(start, end);
  }, [end, path, start]);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: Easing.inOut(Easing.cubic) }, (finished) => {
      if (finished) {
        runOnJS(onFinish)();
      }
    });
  }, [duration, onFinish, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const cfg = path.value;
    const t = progress.value;
    const u = 1 - t;

    const centerX =
      u * u * u * cfg.start.cx +
      3 * u * u * t * cfg.c1.cx +
      3 * u * t * t * cfg.c2.cx +
      t * t * t * cfg.end.cx;
    const centerY =
      u * u * u * cfg.start.cy +
      3 * u * u * t * cfg.c1.cy +
      3 * u * t * t * cfg.c2.cy +
      t * t * t * cfg.end.cy;

    const width = cfg.size.start.width + (cfg.size.end.width - cfg.size.start.width) * t;
    const height = cfg.size.start.height + (cfg.size.end.height - cfg.size.start.height) * t;

    return {
      position: 'absolute',
      left: centerX - width / 2,
      top: centerY - height / 2,
      width,
      height,
      opacity: 1 - 0.7 * t,
      transform: [{ scale: 1 - 0.4 * t }]
    };
  }, []);

  const ghost = useMemo(() => React.cloneElement(element, { pointerEvents: 'none' }), [element]);

  return (
    <AnimatedView pointerEvents="none" style={[styles.flyOverlay, animatedStyle]}>
      {ghost}
    </AnimatedView>
  );
};

// ========== OVERLAY VISUALS (Sparkle, Rings, Fireworks) ==========

type Point = { x: number; y: number };

const SparkleParticle: React.FC<{
  center: Point;
  size: number;
  angle: number;
  dist: number;
  color: string;
  progress: SharedValue<number>;
}> = ({ center, size, angle, dist, color, progress }) => {
  const style = useAnimatedStyle(() => {
    const t = progress.value;
    const dx = Math.cos(angle) * dist * t;
    const dy = Math.sin(angle) * dist * t;
    return {
      position: 'absolute',
      left: center.x,
      top: center.y,
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      borderRadius: size / 2,
      backgroundColor: color,
      opacity: 1 - t,
      transform: [{ translateX: dx }, { translateY: dy }, { scale: 1 - 0.3 * t }]
    } as any;
  }, [center.x, center.y, size, angle, dist, color]);

  return <AnimatedView pointerEvents="none" style={style} />;
};

const SparkleOverlay: React.FC<{
  center: Point;
  count: number;
  color: string;
  duration: number;
  onFinish: () => void;
}> = ({ center, count, color, duration, onFinish }) => {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: Easing.out(Easing.quad) }, (finished) => {
      if (finished) runOnJS(onFinish)();
    });
  }, [duration, onFinish, progress]);

  const parts = useMemo(() => {
    const arr: { size: number; angle: number; dist: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const dist = 36 + Math.random() * 48;
      const size = 3 + Math.random() * 5;
      arr.push({ size, angle, dist });
    }
    return arr;
  }, [count]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {parts.map((p, i) => (
        <SparkleParticle key={i} center={center} size={p.size} angle={p.angle} dist={p.dist} color={color} progress={progress} />
      ))}
    </View>
  );
};

const RingPulse: React.FC<{
  center: Point;
  radius: number;
  color: string;
  thickness: number;
  duration: number;
  delay: number;
  onDone?: () => void;
}> = ({ center, radius, color, thickness, duration, delay, onDone }) => {
  const prog = useSharedValue(0);
  useEffect(() => {
    prog.value = 0;
    prog.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.quad) }, (finished) => {
      if (finished && onDone) runOnJS(onDone)();
    }));
  }, [delay, duration, onDone, prog]);

  const style = useAnimatedStyle(() => {
    const t = prog.value;
    const s = 0.6 + 1.6 * t;
    return {
      position: 'absolute',
      left: center.x - radius,
      top: center.y - radius,
      width: radius * 2,
      height: radius * 2,
      borderRadius: radius,
      borderWidth: thickness,
      borderColor: color,
      opacity: 1 - t,
      transform: [{ scale: s }]
    } as any;
  }, [center.x, center.y, radius, color, thickness]);

  return <AnimatedView pointerEvents="none" style={style} />;
};

const RingsOverlay: React.FC<{
  center: Point;
  color: string;
  duration: number;
  onFinish: () => void;
}> = ({ center, color, duration, onFinish }) => {
  const doneCount = useRef(0);
  const total = 3;
  const onOneDone = () => {
    doneCount.current += 1;
    if (doneCount.current >= total) onFinish();
  };

  const baseRadius = 24;
  const thickness = 2;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <RingPulse center={center} radius={baseRadius} color={color} thickness={thickness} duration={duration} delay={0} onDone={onOneDone} />
      <RingPulse center={center} radius={baseRadius} color={color} thickness={thickness} duration={duration} delay={120} onDone={onOneDone} />
      <RingPulse center={center} radius={baseRadius} color={color} thickness={thickness} duration={duration} delay={240} onDone={onOneDone} />
    </View>
  );
};

const FireworkParticle: React.FC<{
  center: Point;
  size: number;
  angle: number;
  speed: number;
  color: string;
  progress: SharedValue<number>;
}> = ({ center, size, angle, speed, color, progress }) => {
  const style = useAnimatedStyle(() => {
    const t = progress.value; // 0..1
    // Ease out and slight gravity curve
    const ease = t * (2 - t);
    const dx = Math.cos(angle) * speed * ease;
    const dy = Math.sin(angle) * speed * ease - 30 * t * (1 - t);
    return {
      position: 'absolute',
      left: center.x,
      top: center.y,
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      borderRadius: size / 2,
      backgroundColor: color,
      opacity: 1 - t,
      transform: [{ translateX: dx }, { translateY: dy }, { scale: 0.8 + 0.4 * (1 - t) }]
    } as any;
  }, [center.x, center.y, size, angle, speed, color]);

  return <AnimatedView pointerEvents="none" style={style} />;
};

const FireworksOverlay: React.FC<{
  center: Point;
  color: string;
  duration: number;
  onFinish: () => void;
}> = ({ center, color, duration, onFinish }) => {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(onFinish)();
    });
  }, [duration, onFinish, progress]);

  const parts = useMemo(() => {
    const arr: { size: number; angle: number; speed: number }[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 60 + Math.random() * 90;
      const size = 3 + Math.random() * 4;
      arr.push({ size, angle, speed });
    }
    return arr;
  }, []);

  // Initial flash at center
  const flashStyle = useAnimatedStyle(() => {
    const t = progress.value;
    const s = 1 + 1.5 * (1 - t);
    return {
      position: 'absolute',
      left: center.x - 4,
      top: center.y - 4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: color,
      opacity: 0.8 * (1 - t),
      transform: [{ scale: s }]
    } as any;
  }, [center.x, center.y, color]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <AnimatedView pointerEvents="none" style={flashStyle} />
      {parts.map((p, i) => (
        <FireworkParticle key={i} center={center} size={p.size} angle={p.angle} speed={p.speed} color={color} progress={progress} />
      ))}
    </View>
  );
};

export function FlyWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const child = ensureElement(children);
  const fx = useFX();
  const hostRef = useRef<View>(null);
  const targetName = resolveTarget(args);
  const duration = resolveNumber(args?.t ?? args?.duration, 700);

  const childOnPressIn = child.props?.onPressIn;
  const childOnPressOut = child.props?.onPressOut;
  const childOnPress = child.props?.onPress;

  return (
    <Pressable
      ref={hostRef}
      onPressIn={(event: GestureResponderEvent) => {
        callHandler(childOnPressIn, event);
      }}
      onPressOut={(event: GestureResponderEvent) => {
        callHandler(childOnPressOut, event);
      }}
      onPress={async (event: GestureResponderEvent) => {
        callHandler(childOnPress, event);

        const sourceHandle = findNodeHandle(hostRef.current);
        const targetHandle = fx.getTargetHandle(targetName);
        if (!sourceHandle || !targetHandle) {
          if (typeof console !== 'undefined' && typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production') {
            console.warn(`[sparkfx] alvo "${targetName}" não encontrado para fly(). Garanta que o elemento possui fxTarget="${targetName}".`);
          }
          return;
        }

        const [start, end] = await Promise.all([measureHandle(sourceHandle), measureHandle(targetHandle)]);
        if (!start || !end) {
          if (typeof console !== 'undefined' && typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production') {
            console.warn('[sparkfx] não foi possível medir as views para o efeito fly().');
          }
          return;
        }

        const startBox = sanitizeBox(start);
        const endBox = sanitizeBox(end);

        const overlayChild = React.cloneElement(child, {
          pointerEvents: 'none',
          onPress: undefined,
          onPressIn: undefined,
          onPressOut: undefined
        });

        let overlayId = '';
        const cleanup = () => fx.unmountOverlay(overlayId);
        overlayId = fx.mountOverlay(
          <FlyOverlay element={overlayChild} start={startBox} end={endBox} duration={duration} onFinish={cleanup} />
        );
      }}
    >
      <View pointerEvents="box-none">
        {React.cloneElement(child, { onPress: undefined, onPressIn: undefined, onPressOut: undefined })}
      </View>
    </Pressable>
  );
}

// Helpers to measure host center
async function measureCenterOf(ref: React.RefObject<View>): Promise<Point | null> {
  const handle = findNodeHandle(ref.current);
  const box = await measureHandle(handle as any);
  if (!box) return null;
  const s = sanitizeBox(box);
  return { x: s.x + s.width / 2, y: s.y + s.height / 2 };
}

export function SparkleWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const child = ensureElement(children);
  const fx = useFX();
  const hostRef = useRef<View>(null);
  const color = typeof args?.color === 'string' ? args.color : '#f5d0fe';
  const duration = resolveNumber(args?.t ?? args?.duration, 680);
  const childOnPress = child.props?.onPress;

  return (
    <Pressable
      ref={hostRef}
      onPress={async (event: GestureResponderEvent) => {
        callHandler(childOnPress, event);
        const center = await measureCenterOf(hostRef);
        if (!center) return;
        let id = '';
        const cleanup = () => fx.unmountOverlay(id);
        id = fx.mountOverlay(
          <SparkleOverlay center={center} count={12} color={color} duration={duration} onFinish={cleanup} />
        );
      }}
    >
      <View pointerEvents="box-none">{React.cloneElement(child, { onPress: undefined })}</View>
    </Pressable>
  );
}

export function RingsWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const child = ensureElement(children);
  const fx = useFX();
  const hostRef = useRef<View>(null);
  const color = typeof args?.color === 'string' ? args.color : '#93c5fd';
  const duration = resolveNumber(args?.t ?? args?.duration, 700);
  const childOnPress = child.props?.onPress;

  return (
    <Pressable
      ref={hostRef}
      onPress={async (event: GestureResponderEvent) => {
        callHandler(childOnPress, event);
        const center = await measureCenterOf(hostRef);
        if (!center) return;
        let id = '';
        const cleanup = () => fx.unmountOverlay(id);
        id = fx.mountOverlay(
          <RingsOverlay center={center} color={color} duration={duration} onFinish={cleanup} />
        );
      }}
    >
      <View pointerEvents="box-none">{React.cloneElement(child, { onPress: undefined })}</View>
    </Pressable>
  );
}

export function FireworksWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const child = ensureElement(children);
  const fx = useFX();
  const hostRef = useRef<View>(null);
  const color = typeof args?.color === 'string' ? args.color : '#fde68a';
  const duration = resolveNumber(args?.t ?? args?.duration, 800);
  const childOnPress = child.props?.onPress;

  return (
    <Pressable
      ref={hostRef}
      onPress={async (event: GestureResponderEvent) => {
        callHandler(childOnPress, event);
        const center = await measureCenterOf(hostRef);
        if (!center) return;
        let id = '';
        const cleanup = () => fx.unmountOverlay(id);
        id = fx.mountOverlay(
          <FireworksOverlay center={center} color={color} duration={duration} onFinish={cleanup} />
        );
      }}
    >
      <View pointerEvents="box-none">{React.cloneElement(child, { onPress: undefined })}</View>
    </Pressable>
  );
}

export function ToastWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const child = ensureElement(children);
  const fx = useFX();
  const text = typeof args?.text === 'string' ? args.text : typeof args?.message === 'string' ? args.message : 'Feito';
  const duration = resolveNumber(args?.t ?? args?.duration, 1600);
  const childOnPress = child.props?.onPress;

  return React.cloneElement(child, {
    onPress: (event: any) => {
      toast(fx, text, duration);
      callHandler(childOnPress, event);
    }
  });
}

export function toast(fx: ReturnType<typeof useFX>, text = 'Feito', t = 1600) {
  const id = fx.mountOverlay(
    <View style={styles.toastContainer} pointerEvents="none">
      <View style={styles.toastCard}>
        <Text style={styles.toastText}>{text}</Text>
      </View>
    </View>
  );
  setTimeout(() => fx.unmountOverlay(id), t);
}

// ========== ADVANCED EFFECTS ==========

export function JellyWrap({ children }: { children: React.ReactNode }) {
  const child = ensureElement(children);
  const childOnPress = child.props?.onPress;
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }, { scaleY: scaleY.value }]
  }));

  const trigger = (event: any) => {
    scaleX.value = withTiming(1.25, { duration: 240, easing: Easing.out(Easing.cubic) }, () => {
      scaleX.value = withTiming(0.85, { duration: 180 }, () => {
        scaleX.value = withTiming(1.08, { duration: 140 }, () => {
          scaleX.value = withTiming(0.98, { duration: 100 }, () => {
            scaleX.value = withSpring(1, { damping: 12 });
          });
        });
      });
    });
    scaleY.value = withTiming(0.75, { duration: 240, easing: Easing.out(Easing.cubic) }, () => {
      scaleY.value = withTiming(1.15, { duration: 180 }, () => {
        scaleY.value = withTiming(0.92, { duration: 140 }, () => {
          scaleY.value = withTiming(1.02, { duration: 100 }, () => {
            scaleY.value = withSpring(1, { damping: 12 });
          });
        });
      });
    });
    callHandler(childOnPress, event);
  };

  return (
    <Pressable onPress={trigger}>
      <Animated.View style={style} pointerEvents="box-none">
        {React.cloneElement(child, { onPress: undefined })}
      </Animated.View>
    </Pressable>
  );
}

export function WobbleWrap({ children }: { children: React.ReactNode }) {
  const child = ensureElement(children);
  const childOnPress = child.props?.onPress;
  const rotate = useSharedValue(0);
  const translateX = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { translateX: translateX.value }]
  }));

  const trigger = (event: any) => {
    const sequence = [
      { r: -8, x: -6, d: 120 },
      { r: 6, x: 5, d: 120 },
      { r: -5, x: -4, d: 100 },
      { r: 3, x: 3, d: 100 },
      { r: -2, x: -2, d: 80 },
      { r: 0, x: 0, d: 80 }
    ];
    let currentIndex = 0;
    const runNext = () => {
      if (currentIndex >= sequence.length) return;
      const step = sequence[currentIndex];
      rotate.value = withTiming(step.r, { duration: step.d });
      translateX.value = withTiming(step.x, { duration: step.d }, (finished) => {
        if (finished) {
          currentIndex++;
          runOnJS(runNext)();
        }
      });
    };
    runNext();
    callHandler(childOnPress, event);
  };

  return (
    <Pressable onPress={trigger}>
      <Animated.View style={style} pointerEvents="box-none">
        {React.cloneElement(child, { onPress: undefined })}
      </Animated.View>
    </Pressable>
  );
}

export function PulseWrap({ children, interval = 1600 }: { children: React.ReactNode; interval?: number }) {
  const child = ensureElement(children);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }));

  useEffect(() => {
    const animate = () => {
      scale.value = withTiming(1.18, { duration: interval / 2, easing: Easing.inOut(Easing.ease) }, () => {
        scale.value = withTiming(1, { duration: interval / 2, easing: Easing.inOut(Easing.ease) });
      });
      opacity.value = withTiming(0.85, { duration: interval / 2 }, () => {
        opacity.value = withTiming(1, { duration: interval / 2 });
      });
    };
    animate();
    const timer = setInterval(animate, interval);
    return () => clearInterval(timer);
  }, [interval, opacity, scale]);

  return (
    <Animated.View style={style} pointerEvents="box-none">
      {child}
    </Animated.View>
  );
}

export function GlowWrap({ children }: { children: React.ReactNode }) {
  const child = ensureElement(children);
  const opacity = useSharedValue(0.7);

  const style = useAnimatedStyle(() => ({
    shadowColor: '#a78bfa',
    shadowOpacity: opacity.value,
    shadowRadius: 16 + opacity.value * 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 18
  }));

  useEffect(() => {
    const animate = () => {
      opacity.value = withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }, () => {
        opacity.value = withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) });
      });
    };
    animate();
    const timer = setInterval(animate, 2400);
    return () => clearInterval(timer);
  }, [opacity]);

  return (
    <Animated.View style={style} pointerEvents="box-none">
      {child}
    </Animated.View>
  );
}

export function FloatWrap({ children }: { children: React.ReactNode }) {
  const child = ensureElement(children);
  const translateY = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  useEffect(() => {
    const animate = () => {
      translateY.value = withTiming(-12, { duration: 1600, easing: Easing.inOut(Easing.ease) }, () => {
        translateY.value = withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) });
      });
    };
    animate();
    const timer = setInterval(animate, 3200);
    return () => clearInterval(timer);
  }, [translateY]);

  return (
    <Animated.View style={style} pointerEvents="box-none">
      {child}
    </Animated.View>
  );
}

// E-commerce specific effects

export function AddToCartWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const child = ensureElement(children);
  const fx = useFX();
  const hostRef = useRef<View>(null);
  const targetName = resolveTarget(args);
  const childOnPress = child.props?.onPress;

  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      ref={hostRef}
      onPress={async (event: GestureResponderEvent) => {
        // Bounce feedback
        scale.value = withSpring(0.88, { damping: 20 }, () => {
          scale.value = withSpring(1, { damping: 14 });
        });

        callHandler(childOnPress, event);

        const sourceHandle = findNodeHandle(hostRef.current);
        const targetHandle = fx.getTargetHandle(targetName);
        if (!sourceHandle || !targetHandle) {
          toast(fx, '✓ Adicionado ao carrinho', 1400);
          return;
        }

        const [start, end] = await Promise.all([measureHandle(sourceHandle), measureHandle(targetHandle)]);
        if (!start || !end) {
          toast(fx, '✓ Adicionado ao carrinho', 1400);
          return;
        }

        const startBox = sanitizeBox(start);
        const endBox = sanitizeBox(end);

        const overlayChild = React.cloneElement(child, {
          pointerEvents: 'none',
          onPress: undefined
        });

        let overlayId = '';
        const cleanup = () => {
          fx.unmountOverlay(overlayId);
          toast(fx, '✓ Produto adicionado!', 1400);
        };
        overlayId = fx.mountOverlay(
          <FlyOverlay element={overlayChild} start={startBox} end={endBox} duration={650} onFinish={cleanup} />
        );
      }}
    >
      <Animated.View style={style} pointerEvents="box-none">
        {React.cloneElement(child, { onPress: undefined })}
      </Animated.View>
    </Pressable>
  );
}

export function QuickViewWrap({ children }: { children: React.ReactNode }) {
  const child = ensureElement(children);
  const childOnPress = child.props?.onPress;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }));

  const trigger = (event: any) => {
    scale.value = withSpring(1.08, { damping: 18 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    opacity.value = withTiming(0.85, { duration: 150 }, () => {
      opacity.value = withTiming(1, { duration: 150 });
    });
    callHandler(childOnPress, event);
  };

  return (
    <Pressable onPress={trigger}>
      <Animated.View style={style} pointerEvents="box-none">
        {React.cloneElement(child, { onPress: undefined })}
      </Animated.View>
    </Pressable>
  );
}

export function HeartbeatWrap({ children }: { children: React.ReactNode }) {
  const child = ensureElement(children);
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  useEffect(() => {
    const animate = () => {
      scale.value = withTiming(1.15, { duration: 196, easing: Easing.out(Easing.cubic) }, () => {
        scale.value = withTiming(1, { duration: 140 }, () => {
          scale.value = withTiming(1.2, { duration: 196 }, () => {
            scale.value = withTiming(1, { duration: 420 });
          });
        });
      });
    };
    animate();
    const timer = setInterval(animate, 1400);
    return () => clearInterval(timer);
  }, [scale]);

  return (
    <Animated.View style={style} pointerEvents="box-none">
      {child}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ripplePressable: {
    overflow: 'hidden'
  },
  rippleOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rippleCircle: {
    backgroundColor: '#ffffff20'
  },
  flyOverlay: {
    position: 'absolute'
  },
  toastContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center'
  },
  toastCard: {
    backgroundColor: '#0d1117',
    borderColor: '#222933',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 18
  },
  toastText: {
    color: '#fff',
    fontWeight: '700'
  }
});

// ============================================================
// PREMIUM HARVARD-LEVEL EFFECTS
// ============================================================

/**
 * ELASTIC SCALE - Escala elástica avançada com overshoot
 */
export function ElasticScaleWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const scale = useSharedValue(1);
  const intensity = resolveNumber(args?.intensity, 1.4);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const onPress = (event: GestureResponderEvent) => {
    scale.value = withSpring(intensity, {
      damping: 3,
      stiffness: 100,
      mass: 0.5
    });
    setTimeout(() => {
      scale.value = withSpring(1, {
        damping: 8,
        stiffness: 150,
        mass: 0.8
      });
    }, 100);
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * NEON GLOW - Brilho neon pulsante contínuo
 */
export function NeonGlowWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const color = args?.color || '#00ffff';

  useEffect(() => {
    const animate = () => {
      opacity.value = withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) });
      scale.value = withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) });
      setTimeout(() => {
        opacity.value = withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) });
        scale.value = withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) });
      }, 800);
    };
    animate();
    const interval = setInterval(animate, 1600);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    shadowColor: color,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 }
  }));

  return <AnimatedView style={animatedStyle}>{element}</AnimatedView>;
}

/**
 * PERSPECTIVE TILT - Efeito 3D tilt com perspectiva
 */
export function PerspectiveTiltWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` }
    ]
  }));

  const onPress = (event: GestureResponderEvent) => {
    rotateX.value = withSpring(-10, { damping: 10, stiffness: 100 });
    rotateY.value = withSpring(10, { damping: 10, stiffness: 100 });
    setTimeout(() => {
      rotateX.value = withSpring(0, { damping: 8, stiffness: 80 });
      rotateY.value = withSpring(0, { damping: 8, stiffness: 80 });
    }, 200);
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * MAGNETIC HOVER - Atração magnética (pressionar e segurar)
 */
export function MagneticHoverWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ]
  }));

  const onPressIn = (event: GestureResponderEvent) => {
    translateX.value = withSpring(5, { damping: 15, stiffness: 150 });
    translateY.value = withSpring(-3, { damping: 15, stiffness: 150 });
    scale.value = withSpring(1.08, { damping: 10, stiffness: 100 });
    callHandler(element.props.onPressIn, event);
  };

  const onPressOut = (event: GestureResponderEvent) => {
    translateX.value = withSpring(0, { damping: 12, stiffness: 120 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 120 });
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    callHandler(element.props.onPressOut, event);
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * GRAVITY - Efeito de gravidade com queda
 */
export function GravityWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` }
    ]
  }));

  const onPress = (event: GestureResponderEvent) => {
    translateY.value = withTiming(-50, { duration: 300, easing: Easing.out(Easing.quad) });
    rotate.value = withTiming(-15, { duration: 300 });
    setTimeout(() => {
      translateY.value = withTiming(300, { duration: 600, easing: Easing.in(Easing.quad) });
      rotate.value = withTiming(180, { duration: 600 });
      setTimeout(() => {
        translateY.value = withSpring(0, { damping: 8, stiffness: 100 });
        rotate.value = withSpring(0, { damping: 10, stiffness: 80 });
      }, 600);
    }, 300);
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * SPRING PHYSICS - Física de mola avançada
 */
export function SpringPhysicsWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const translateX = useSharedValue(0);
  const damping = resolveNumber(args?.damping, 3);
  const stiffness = resolveNumber(args?.stiffness, 50);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  const onPress = (event: GestureResponderEvent) => {
    translateX.value = withSpring(100, { damping, stiffness, mass: 1 });
    setTimeout(() => {
      translateX.value = withSpring(-100, { damping, stiffness, mass: 1 });
      setTimeout(() => {
        translateX.value = withSpring(0, { damping: damping + 5, stiffness: stiffness + 30, mass: 0.8 });
      }, 400);
    }, 400);
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * ROTATE 3D - Rotação 3D completa
 */
export function Rotate3DWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { rotateZ: `${rotateZ.value}deg` }
    ]
  }));

  const onPress = (event: GestureResponderEvent) => {
    rotateX.value = withTiming(360, { duration: 800, easing: Easing.inOut(Easing.ease) });
    rotateY.value = withTiming(360, { duration: 800, easing: Easing.inOut(Easing.ease) });
    rotateZ.value = withTiming(360, { duration: 800, easing: Easing.inOut(Easing.ease) });
    setTimeout(() => {
      rotateX.value = 0;
      rotateY.value = 0;
      rotateZ.value = 0;
    }, 800);
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * FLIP CARD - Virar carta 3D
 */
export function FlipCardWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const rotateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotateY.value}deg` }
    ]
  }));

  const onPress = (event: GestureResponderEvent) => {
    const isFlipped = Math.abs(rotateY.value % 360) > 90;
    rotateY.value = withSpring(isFlipped ? 0 : 180, { damping: 15, stiffness: 80 });
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * WAVE 3D - Onda 3D com movimento fluido
 */
export function Wave3DWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const translateY = useSharedValue(0);
  const rotateX = useSharedValue(0);

  useEffect(() => {
    const animate = () => {
      translateY.value = withTiming(-15, { duration: 600, easing: Easing.inOut(Easing.sin) });
      rotateX.value = withTiming(10, { duration: 600, easing: Easing.inOut(Easing.sin) });
      setTimeout(() => {
        translateY.value = withTiming(0, { duration: 600, easing: Easing.inOut(Easing.sin) });
        rotateX.value = withTiming(0, { duration: 600, easing: Easing.inOut(Easing.sin) });
      }, 600);
    };
    animate();
    const interval = setInterval(animate, 1200);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { translateY: translateY.value },
      { rotateX: `${rotateX.value}deg` }
    ]
  }));

  return <AnimatedView style={animatedStyle}>{element}</AnimatedView>;
}

/**
 * QUANTUM BLUR - Blur quântico com fade
 */
export function QuantumBlurWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));

  const onPress = (event: GestureResponderEvent) => {
    opacity.value = withTiming(0.2, { duration: 150 });
    scale.value = withTiming(0.92, { duration: 150 });
    setTimeout(() => {
      opacity.value = withSpring(1, { damping: 10, stiffness: 100 });
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    }, 150);
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * LIQUID SWIPE - Transição líquida suave
 */
export function LiquidSwipeWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    opacity: opacity.value
  }));

  const onPress = (event: GestureResponderEvent) => {
    translateX.value = withTiming(300, { duration: 400, easing: Easing.inOut(Easing.ease) });
    scale.value = withTiming(0.8, { duration: 400 });
    opacity.value = withTiming(0, { duration: 400 });
    setTimeout(() => {
      translateX.value = -300;
      scale.value = 0.8;
      opacity.value = 0;
      setTimeout(() => {
        translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
        scale.value = withSpring(1, { damping: 15, stiffness: 100 });
        opacity.value = withTiming(1, { duration: 300 });
      }, 50);
    }, 400);
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * PARTICLE EXPLOSION - Explosão de partículas (simulado com scale/opacity)
 */
export function ParticleExplosionWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }));

  const onPress = (event: GestureResponderEvent) => {
    scale.value = withTiming(2, { duration: 300, easing: Easing.out(Easing.exp) });
    opacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      scale.value = 1;
      opacity.value = withSpring(1, { damping: 10, stiffness: 100 });
    }, 300);
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * FRICTION - Arrasto com fricção
 */
export function FrictionWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  const onPress = (event: GestureResponderEvent) => {
    translateX.value = withTiming(120, { duration: 800, easing: Easing.out(Easing.cubic) });
    setTimeout(() => {
      translateX.value = withSpring(0, { damping: 20, stiffness: 90, mass: 1.5 });
    }, 800);
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}

/**
 * INERTIA - Movimento com inércia
 */
export function InertiaWrap({ children, args }: { children: React.ReactNode; args?: FxArgs }) {
  const element = ensureElement(children);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }));

  const onPress = (event: GestureResponderEvent) => {
    translateX.value = withTiming(80, { duration: 500, easing: Easing.linear });
    translateY.value = withTiming(-40, { duration: 500, easing: Easing.out(Easing.quad) });
    setTimeout(() => {
      translateY.value = withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) });
      setTimeout(() => {
        translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
      }, 200);
    }, 500);
    callHandler(element.props.onPress, event);
  };

  return (
    <Pressable onPress={onPress}>
      <AnimatedView style={animatedStyle}>{element}</AnimatedView>
    </Pressable>
  );
}
