# @ranilson/sparkfx-rn

Biblioteca de efeitos para React Native/Expo usando o atributo `fx`.

Funciona em React Native, Expo e tem paridade com diversos efeitos do Web. Inclui animações de toque, triggers visuais e helpers de alvo (targets) para cenários de e-commerce.

Demo (Web): https://Ranilson-Nascimento.github.io/sparkfx/

## Instalação

```bash
npm install @ranilson/sparkfx-rn react-native-reanimated react-native-gesture-handler
```

Depois, importe o modo automático no entrada do app (por exemplo, `index.js`):

```ts
import '@ranilson/sparkfx-rn/auto';
```

## Uso rápido

```tsx
import '@ranilson/sparkfx-rn/auto';
import { Pressable, View, Text } from 'react-native';
import { useFxTarget } from '@ranilson/sparkfx-rn';

export default function App(){
  const cart = useFxTarget('cart');
  return (
    <>
      <Pressable fx="jelly|addtocart(cart)|ripple"><Text>Adicionar</Text></Pressable>
      <View {...cart}><Text>Carrinho</Text></View>
    </>
  );
}
```

## Principais efeitos

- Interação: `bounce`, `ripple`, `shake`, `jelly`, `wobble`, `presspop`
- Ênfase: `pulse`, `glow`, `float`, `heartbeat`
- E-commerce: `addtocart(target)`, `fly(target)`, `toast(text)`
- Triggers (Web): `particles`, `spiral`, `sparkle`, `rings`, `fireworks`

## Licença

MIT © Ranilson
