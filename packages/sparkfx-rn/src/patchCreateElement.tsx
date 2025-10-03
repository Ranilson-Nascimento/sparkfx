
import React from 'react';
import { applyFx } from './registry';
import { FXTargetBoundary } from './FXTargetBoundary';

let patched=false;
export function patchCreateElement(){
  if (patched) return; patched=true;
  const orig = React.createElement;
  (React as any).createElement = (type:any, props:any, ...children:any[]) => {
    if (!props) {
      return orig(type, props, ...children);
    }
    const fxProp = typeof props.fx === 'string' ? props.fx : undefined;
    const fxTarget = typeof props.fxTarget === 'string' ? props.fxTarget : undefined;

    if (!fxProp && !fxTarget) {
      return orig(type, props, ...children);
    }

    const nextProps = { ...props };
    if (fxProp) delete nextProps.fx;
    if (fxTarget) delete nextProps.fxTarget;

    let node: React.ReactElement = orig(type, nextProps, ...children) as React.ReactElement;

    if (fxProp) {
      node = applyFx(node, fxProp);
    }

    if (fxTarget) {
      const originalRef = (node as any).ref ?? null;
      node = React.createElement(
        FXTargetBoundary,
        {
          name: fxTarget,
          element: node,
          originalRef: originalRef
        },
        null
      ) as React.ReactElement;
    }

    return node;
  };
}
