# @ranilson/sparkfx-rn

# @ranilson/sparkfx-rn v0.5

**28+ efeitos de animação de NÍVEL HARVARD com um único atributo `fx="..."` no React Native.**

**25+ animações com um único atributo `fx="..."` no React Native (Reanimated + Gesture Handler).**

Efeitos premium que funcionam perfeitamente em **React Native**, **Expo** e **Web**. Física realista, transformações 3D, e animações fluidas de classe mundial.
# @ranilson/sparkfx-rn

Biblioteca de efeitos para React Native/Expo usando o atributo `fx`.

Funciona em **React Native**, **Expo** e possui paridade com diversos efeitos do **Web**. Inclui animações de toque, triggers visuais e helpers de alvo (targets) para cenários de e-commerce.

Demo (Web): https://Ranilson-Nascimento.github.io/sparkfx/

## Instalação

```bash
npm install @ranilson/sparkfx-rn react-native-reanimated react-native-gesture-handler

// Em seguida, importe o modo automático no entry point
import '@ranilson/sparkfx-rn/auto';
  </View>

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
  <Text style={styles.offer}>🔥 50% OFF</Text>
