import 'react';

declare module 'react' {
  interface Attributes {
    fx?: string;
    fxTarget?: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      fx?: string;
      fxTarget?: string;
    }
  }
}

export {};
