/** @jsxRuntime classic */
/** @jsx React.createElement */
import React from 'react';
import { AppRegistry } from 'react-native';
import { FXProvider } from './FXContext';
import { patchCreateElement } from './patchCreateElement';

patchCreateElement();

const orig = AppRegistry.registerComponent;
if ((AppRegistry as any).__sparkfxPatched !== true) {
  (AppRegistry as any).__sparkfxPatched = true;
  AppRegistry.registerComponent = (appKey: string, getComp: any) => {
    const wrapped = () => {
      const C = getComp();
      return () => (
        <FXProvider>
          <C />
        </FXProvider>
      );
    };
    return orig.call(AppRegistry, appKey, wrapped);
  };
}
