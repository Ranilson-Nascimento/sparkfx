
import React from 'react';
import { parseFx, type FxItem } from './parseFx';
import { 
  BounceWrap, 
  RippleWrap, 
  ShakeWrap, 
  FlyWrap, 
  ToastWrap,
  JellyWrap,
  WobbleWrap,
  PulseWrap,
  GlowWrap,
  FloatWrap,
  AddToCartWrap,
  QuickViewWrap,
  HeartbeatWrap,
  ElasticScaleWrap,
  NeonGlowWrap,
  PerspectiveTiltWrap,
  MagneticHoverWrap,
  GravityWrap,
  SpringPhysicsWrap,
  Rotate3DWrap,
  FlipCardWrap,
  Wave3DWrap,
  QuantumBlurWrap,
  LiquidSwipeWrap,
  ParticleExplosionWrap,
  FrictionWrap,
  InertiaWrap,
  PressPopWrap,
  SparkleWrap,
  RingsWrap,
  FireworksWrap
} from './effects';

function resolveNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

type Wrapper = (node: React.ReactElement, item: FxItem) => React.ReactElement;

const registry: Record<string, Wrapper> = {
  // Original Effects
  bounce: (node, item) => <BounceWrap s={resolveNumber(item.args?.s, 0.94)}>{node}</BounceWrap>,
  ripple: (node, item) => <RippleWrap r={resolveNumber(item.args?.r, 80)} op={resolveNumber(item.args?.op, 0.18)}>{node}</RippleWrap>,
  presspop: (node, item) => <PressPopWrap s={resolveNumber(item.args?.s, 1.08)}>{node}</PressPopWrap>,
  shake: (node) => <ShakeWrap>{node}</ShakeWrap>,
  fly: (node, item) => <FlyWrap args={item.args}>{node}</FlyWrap>,
  toast: (node, item) => <ToastWrap args={item.args}>{node}</ToastWrap>,
  
  // Advanced Effects
  jelly: (node) => <JellyWrap>{node}</JellyWrap>,
  wobble: (node) => <WobbleWrap>{node}</WobbleWrap>,
  pulse: (node, item) => <PulseWrap interval={resolveNumber(item.args?.interval, 1600)}>{node}</PulseWrap>,
  glow: (node) => <GlowWrap>{node}</GlowWrap>,
  float: (node) => <FloatWrap>{node}</FloatWrap>,
  heartbeat: (node) => <HeartbeatWrap>{node}</HeartbeatWrap>,
  
  // E-commerce Effects
  addtocart: (node, item) => <AddToCartWrap args={item.args}>{node}</AddToCartWrap>,
  quickview: (node) => <QuickViewWrap>{node}</QuickViewWrap>,
  
  // Premium Harvard-Level Effects
  elasticscale: (node, item) => <ElasticScaleWrap args={item.args}>{node}</ElasticScaleWrap>,
  elastic: (node, item) => <ElasticScaleWrap args={item.args}>{node}</ElasticScaleWrap>,
  neonglow: (node, item) => <NeonGlowWrap args={item.args}>{node}</NeonGlowWrap>,
  neon: (node, item) => <NeonGlowWrap args={item.args}>{node}</NeonGlowWrap>,
  perspectivetilt: (node, item) => <PerspectiveTiltWrap args={item.args}>{node}</PerspectiveTiltWrap>,
  tilt: (node, item) => <PerspectiveTiltWrap args={item.args}>{node}</PerspectiveTiltWrap>,
  magnetichover: (node, item) => <MagneticHoverWrap args={item.args}>{node}</MagneticHoverWrap>,
  magnetic: (node, item) => <MagneticHoverWrap args={item.args}>{node}</MagneticHoverWrap>,
  
  // Physics Effects
  gravity: (node, item) => <GravityWrap args={item.args}>{node}</GravityWrap>,
  springphysics: (node, item) => <SpringPhysicsWrap args={item.args}>{node}</SpringPhysicsWrap>,
  spring: (node, item) => <SpringPhysicsWrap args={item.args}>{node}</SpringPhysicsWrap>,
  friction: (node, item) => <FrictionWrap args={item.args}>{node}</FrictionWrap>,
  inertia: (node, item) => <InertiaWrap args={item.args}>{node}</InertiaWrap>,
  
  // 3D Transform Effects
  rotate3d: (node, item) => <Rotate3DWrap args={item.args}>{node}</Rotate3DWrap>,
  flipcard: (node, item) => <FlipCardWrap args={item.args}>{node}</FlipCardWrap>,
  flip: (node, item) => <FlipCardWrap args={item.args}>{node}</FlipCardWrap>,
  wave3d: (node, item) => <Wave3DWrap args={item.args}>{node}</Wave3DWrap>,
  wave: (node, item) => <Wave3DWrap args={item.args}>{node}</Wave3DWrap>,
  
  // Special Effects
  quantumblur: (node, item) => <QuantumBlurWrap args={item.args}>{node}</QuantumBlurWrap>,
  quantum: (node, item) => <QuantumBlurWrap args={item.args}>{node}</QuantumBlurWrap>,
  liquidswipe: (node, item) => <LiquidSwipeWrap args={item.args}>{node}</LiquidSwipeWrap>,
  liquid: (node, item) => <LiquidSwipeWrap args={item.args}>{node}</LiquidSwipeWrap>,
  particleexplosion: (node, item) => <ParticleExplosionWrap args={item.args}>{node}</ParticleExplosionWrap>,
  explosion: (node, item) => <ParticleExplosionWrap args={item.args}>{node}</ParticleExplosionWrap>,
  particles: (node, item) => <ParticleExplosionWrap args={item.args}>{node}</ParticleExplosionWrap>,

  // Visual trigger overlays (web parity)
  sparkle: (node, item) => <SparkleWrap args={item.args}>{node}</SparkleWrap>,
  rings: (node, item) => <RingsWrap args={item.args}>{node}</RingsWrap>,
  fireworks: (node, item) => <FireworksWrap args={item.args}>{node}</FireworksWrap>
};

export function applyFx(node: React.ReactElement, fxSource: string) {
  const list = parseFx(fxSource);
  if (!list.length) return node;

  return list.reduce<React.ReactElement>((acc, item) => {
    const wrap = registry[item.name];
    if (!wrap) return acc;
    return wrap(acc, item);
  }, node);
}
