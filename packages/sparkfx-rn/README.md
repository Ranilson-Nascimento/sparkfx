# @ranilson/sparkfx-rn v0.6.0 🎓

# @ranilson/sparkfx-rn v0.5

**28+ efeitos de animação de NÍVEL HARVARD com um único atributo `fx="..."` no React Native.**

**25+ animações com um único atributo `fx="..."` no React Native (Reanimated + Gesture Handler).**

Efeitos premium que funcionam perfeitamente em **React Native**, **Expo** e **Web**. Física realista, transformações 3D, e animações fluidas de classe mundial.
# @ranilson/sparkfx-rn v0.1.0


    <Text>Clique para cair!</Text>  };
</Pressable>  return <Pressable onPress={handleCustomAction}>...</Pressable>;

}

// Card 3D Flip```

<Pressable fx="flipcard|ripple">

  <View style={styles.card}>## 📱 Expo Demo

    <Text>Flip me!</Text>

  </View>Veja o app de exemplo completo em `examples/expo-sparkfx-demo/`:

</Pressable>

```bash

// Card com Onda 3D (contínuo)cd examples/expo-sparkfx-demo

<View fx="wave3d">npm install

  <View style={styles.card}>npm start

    <Text>Onda contínua</Text>```

  </View>

</View>O demo mostra:

```- ✅ Todos os 25+ efeitos

- ✅ Grid de produtos e-commerce

### Animações Contínuas (Chamar atenção)- ✅ Animações de adicionar ao carrinho

- ✅ Combos complexos de efeitos

```tsx- ✅ Targets múltiplos (carrinho, wishlist)
  <Text style={styles.offer}>🔥 50% OFF</Text>

</View>```bash
// Badge Premium com Pulsenpm run build      # Gera dist/ com tipos

<View fx="pulse">npm run dev        # Watch mode
</View>```



<View fx="float">

  <Text style={styles.balloon}>🎈 Flutuando</Text>MIT

</View>

## ⚡ Features

// Onda 3D

<View fx="wave3d">- ✅ **25+ animações** prontas para usar

  <Text style={styles.wave}>🌊 Wave 3D</Text>- ✅ **Zero configuração** - um import e está pronto

</View>- ✅ **Performance nativa** com Reanimated

```- ✅ **Composição flexível** - combine efeitos com `|`

- ✅ **TypeScript** - tipos completos incluídos

### Ultra Combos Premium- ✅ **E-commerce ready** - efeitos específicos para lojas

- ✅ **Cross-platform** - iOS + Android + Web (com sparkfx-web)

```tsx

// Mega Ultra Combo (Elastic + Neon + Ripple)
<Pressable fx="elastic|neonglow|ripple">
  <Text>🔥 MEGA ULTRA COMBO</Text>
</Pressable>

// Quantum Magnetic (Magnetic + Quantum + Glow)
<Pressable fx="magnetic|quantum|glow">
  <Text>⚡ QUANTUM MAGNETIC</Text>
</Pressable>

// Liquid Explosion (Liquid + Explosion + Fly)
<Pressable fx="liquid|explosion|fly(cart)">
  <Text>🚀 LIQUID EXPLOSION</Text>
</Pressable>

// 3D Neon Rotation
<Pressable fx="rotate3d|neonglow|ripple">
  <Text>🌀 3D NEON ROTATION</Text>
</Pressable>

// Physics Premium (Spring + Glow + Ripple)
<Pressable fx="spring|glow|ripple">
  <Text>🎯 SPRING PHYSICS</Text>
</Pressable>
```

---

## 🎨 Categorias de Efeitos

### 🎯 Por Tipo de Interação

- **Clique/Tap**: `bounce`, `ripple`, `shake`, `jelly`, `wobble`, `elastic`, `tilt`, `magnetic`, `quantum`, `gravity`, `spring`, `friction`, `inertia`, `rotate3d`, `flipcard`, `liquid`, `explosion`
- **Contínuas**: `pulse`, `glow`, `float`, `heartbeat`, `neonglow`, `wave3d`
- **Navegação**: `fly`, `addtocart`, `quickview`
- **Feedback**: `toast`, `ripple`

### 💼 Por Caso de Uso

- **E-commerce**: `addtocart`, `quickview`, `fly`, `elastic`, `magnetic`
- **CTAs Premium**: `elastic`, `neonglow`, `magnetic`, `tilt`
- **Ofertas/Promoções**: `pulse`, `glow`, `heartbeat`, `neonglow`
- **Cards/Produtos**: `flipcard`, `tilt`, `wave3d`, `quickview`
- **Física/Games**: `gravity`, `spring`, `friction`, `inertia`
- **Visual Premium**: `rotate3d`, `liquid`, `explosion`, `quantum`

---

## 🏆 Recursos Avançados

### Targets Customizados

```tsx
// Múltiplos targets
const cartTarget = useFxTarget('cart');
const wishlistTarget = useFxTarget('wishlist');
const notificationTarget = useFxTarget('notification');

<Pressable fx="fly(cart)">Carrinho</Pressable>
<Pressable fx="fly(wishlist)">Favoritos</Pressable>
<Pressable fx="fly(notification)">Notificar</Pressable>
```

### Parâmetros Dinâmicos

```tsx
// Toast com mensagem customizada
<Pressable fx="toast(text='Produto adicionado!', t=2000)">
  <Text>Adicionar</Text>
</Pressable>

// Bounce com scale customizado
<Pressable fx="bounce(s=0.85)">
  <Text>Bounce Forte</Text>
</Pressable>

// Ripple com raio e opacidade customizados
<Pressable fx="ripple(r=120, op=0.3)">
  <Text>Ripple Grande</Text>
</Pressable>
```

---

## 📊 Comparação com Bibliotecas Similares

| Recurso | SparkFX | Framer Motion | React Spring | Animated API |
|---------|---------|---------------|--------------|--------------|
| Sintaxe | `fx="bounce"` | JSX verboso | Hooks complexos | Imperativo |
| Combos | `fx="a\|b\|c"` | ❌ Manual | ❌ Manual | ❌ Manual |
| React Native | ✅ | ❌ | Parcial | ✅ |
| Expo | ✅ | ❌ | Parcial | ✅ |
| Web | ✅ | ✅ | ✅ | ❌ |
| Física | ✅ 4 efeitos | ✅ | ✅ | Básico |
| 3D | ✅ 3 efeitos | ✅ | ❌ | Básico |
| E-commerce | ✅ `addtocart` | ❌ | ❌ | ❌ |
| Targets | ✅ `fly(cart)` | ❌ | ❌ | ❌ |
| Bundle | ~58KB | ~100KB | ~60KB | Nativo |
| Premium FX | ✅ 7 efeitos | ❌ | ❌ | ❌ |

---

## 🎓 Nível Harvard

SparkFX v0.6.0 implementa princípios de animação de classe mundial:

### Física Realista
- **Gravity**: Simula queda livre com aceleração (9.8m/s²)
- **Spring Physics**: Mola harmônica com damping e stiffness
- **Friction**: Arrasto quadrático realista
- **Inertia**: Conservação de momento com trajetória parabólica

### Transformações 3D
- **Perspective**: Projeção correta com ponto de fuga
- **Rotate3D**: Rotação euleriana em 3 eixos
- **FlipCard**: Transformação de matriz com backface culling
- **Wave3D**: Onda senoidal em 3D com fase temporal

### Efeitos Premium
- **Elastic**: Overshoot com função de mola amortecida
- **NeonGlow**: Shadow pulsante com easing sinusoidal
- **Magnetic**: Atração com força inversamente proporcional à distância
- **Quantum**: Transição de estado com superposição

---

## 📦 Especificações Técnicas

- **React Native**: ✅ 0.72+
- **Expo**: ✅ SDK 49+
- **Reanimated**: ✅ 3.0+
- **Gesture Handler**: ✅ 2.0+
- **TypeScript**: ✅ Full support
- **Bundle Size**: ~58KB (CJS), ~46KB (ESM)
- **Efeitos**: 28+ (13 básicos + 15 premium)
- **Performance**: 60 FPS garantido
- **Plataformas**: iOS, Android, Web

---

## 📄 Licença

MIT © Ranilson

---

**⚡ Powered by SparkFX v0.6.0 — Animations of Harvard Level**
