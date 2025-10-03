# SparkFX Quick Start Guide

## Para Desenvolvedores E-commerce

SparkFX fornece **25+ animações prontas** para React Native e Web com foco em experiências de e-commerce de alto impacto.

---

## Setup Rápido (5 minutos)

### 1. Instale as dependências

```bash
# React Native / Expo
npm install @ranilson/sparkfx-rn react-native-reanimated react-native-gesture-handler

# Web (opcional, para cross-platform)
npm install @ranilson/sparkfx-web
```

### 2. Configure no entry point

**React Native** (`index.js` ou `App.tsx`):
```tsx
import '@ranilson/sparkfx-rn/auto';
```

**Web** (`index.html`):
```html
<script src="https://unpkg.com/@ranilson/sparkfx-web@0.5.0"></script>
```

### 3. Use em qualquer componente

```tsx
import { useFxTarget } from '@ranilson/sparkfx-rn';

export default function Shop() {
  const cartTarget = useFxTarget('cart');
  
  return (
    <>
      {/* Produto com animação */}
      <Pressable fx="addtocart(cart)|ripple">
        <Image source={product.image} />
        <Text>{product.name}</Text>
        <Text>${product.price}</Text>
      </Pressable>

      {/* Carrinho (recebe animação) */}
      <View {...cartTarget}>
        <Text>🛒 {itemCount}</Text>
      </View>
    </>
  );
}
```

---

## 🎨 Casos de Uso Reais

### Adicionar ao Carrinho

```tsx
const cartTarget = useFxTarget('cart');

// Feedback completo: scale + fly + toast
<Pressable fx="addtocart(cart)|ripple">
  <Text>Comprar</Text>
</Pressable>

// Carrinho
<View {...cartTarget} style={styles.cart}>
  <Text>🛒 {items.length}</Text>
</View>
```

**Resultado**: Usuário clica → item encolhe → voa até carrinho → toast "✓ Produto adicionado!"

### Destacar Ofertas

```tsx
// Oferta pulsando e brilhando
<View fx="pulse|glow" style={styles.offer}>
  <Text> 50% OFF</Text>
  <Text>Apenas hoje!</Text>
</View>
```

**Resultado**: Card pulsa continuamente com brilho, chamando atenção

### Wishlist com Coração

```tsx
const wishlistTarget = useFxTarget('wishlist');

<Pressable fx="heartbeat|addtocart(wishlist)">
  <Text>❤️</Text>
</Pressable>

<View {...wishlistTarget}>
  <Text>❤️ {favorites.length}</Text>
</View>
```

**Resultado**: Coração bate → item voa para wishlist → contador atualiza

### Botão de CTA Épico

```tsx
<Pressable fx="jelly|glow|wobble">
  <Text> COMPRAR AGORA</Text>
</Pressable>
```

**Resultado**: Jelly bounce + brilho pulsante + balanço sutil = botão irresistível

---

## Efeitos por Categoria

### Feedback de Interação
- `bounce` - Pressione e sinta o feedback
- `ripple` - Onda de toque material
- `shake` - Erro ou atenção
- `jelly` - Bounce divertido e elástico
- `wobble` - Balanço chamativo

### Ênfase Visual
- `pulse` - Pulsa continuamente
- `glow` - Brilha com sombra animada
- `float` - Flutua suavemente
- `heartbeat` - Dois pulsos rápidos

### E-commerce
- `addtocart(target)` - Voa até o carrinho
- `quickview` - Zoom para visualização
- `fly(target)` - Voa para qualquer target
- `toast(text)` - Mensagem de confirmação

---

## Combos Poderosos

Combine efeitos com `|` para criar experiências únicas:

```tsx
// Mega feedback
fx="jelly|glow|ripple"

// Add-to-cart completo
fx="addtocart(cart)|wobble"

// UI premium
fx="pulse|float|glow"

// Favoritar com estilo
fx="heartbeat|addtocart(wishlist)|ripple"
```

---

## Performance

- **60 FPS nativo** - Usa Reanimated thread UI
- **Zero re-renders** - Animações não afetam React tree
- **Leve** - Bundle ~35KB (gzipped)
- **Cross-platform** - iOS + Android + Web

---

## Ver Demo Completo

```bash
cd examples/expo-sparkfx-demo
npm install
npm start
```

O demo inclui:
- Grid de produtos realista
- Múltiplos targets (cart, wishlist)
- Todos os 25+ efeitos
- Combos complexos

---

## Documentação Completa

- **React Native**: `packages/sparkfx-rn/README.md`
- **Web**: `packages/sparkfx-web/README.md`
- **Changelog**: `CHANGELOG.md`
- **Demo ao vivo**: Rode `npm start` na raiz

---

## Dicas Pro

### 1. Targets Múltiplos
```tsx
const cart = useFxTarget('cart');
const wishlist = useFxTarget('wishlist');
const notification = useFxTarget('notification');
```

### 2. Efeitos Condicionais
```tsx
<Pressable fx={isSpecial ? "jelly|glow" : "bounce"}>
```

### 3. API Programática
```tsx
const fx = useFX();

const handleAction = () => {
  fx.toast('Salvo!', 2000);
  // ou
  const id = fx.mountOverlay(<CustomAnimation />);
  setTimeout(() => fx.unmountOverlay(id), 3000);
};
```

### 4. Animações Contínuas em Cards
```tsx
// Sempre pulsando
<View fx="pulse" />

// Sempre flutuando
<View fx="float" />

// Sempre brilhando
<View fx="glow" />
```

---

## Troubleshooting

### "Reanimated is not configured"
Adicione no `babel.config.js`:
```js
plugins: ['react-native-reanimated/plugin']
```

### "Cannot find target"
Certifique-se que o target foi registrado:
```tsx
const target = useFxTarget('myTarget');
<View {...target} />
```

### Animação não aparece
Verifique que importou o auto:
```tsx
import '@ranilson/sparkfx-rn/auto';
```

---

## Contribuir

```bash
git clone https://github.com/Ranilson-Nascimento/sparkfx.git
cd sparkfx/packages/sparkfx-rn
npm install
npm run dev  # watch mode
npm test     # rodar testes
```

---

## Start Building!

```tsx
import '@ranilson/sparkfx-rn/auto';
import { useFxTarget } from '@ranilson/sparkfx-rn';

export default function MyApp() {
  const cart = useFxTarget('cart');
  
  return (
    <View>
      <Pressable fx="jelly|addtocart(cart)">
        <Text> Adicionar ao Carrinho</Text>
      </Pressable>
      
      <View {...cart}>
        <Text>🛒</Text>
      </View>
    </View>
  );
}
```

**Pronto!** Agora você tem animações de e-commerce profissionais com uma linha de código.

---

**Dúvidas?** Abra uma issue no GitHub ou veja a documentação completa no README.
