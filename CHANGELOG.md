# SparkFX Changelog

## v0.5.0 - React Native Parity & E-commerce Focus (Janeiro 2025)

### 🎉 Grandes Novidades

- **25+ animações** agora disponíveis tanto em Web quanto em React Native
- **8 novos efeitos avançados** portados do web para RN
- **2 efeitos específicos para e-commerce** (addtocart, quickview)
- **Demo completo** mostrando todos os efeitos em contexto real

### ✨ Novos Efeitos (sparkfx-rn v0.5.0)

#### Efeitos Avançados
- **jelly** - Bounce elástico com squash & stretch usando Reanimated
- **wobble** - Balanço lateral oscilante com rotação e translação
- **pulse** - Pulsação contínua configurável (scale + opacity)
- **glow** - Brilho pulsante usando shadowOpacity animado
- **float** - Flutuação suave vertical contínua
- **heartbeat** - Batimento cardíaco (dois pulsos rápidos em sequência)

#### E-commerce Profissionais
- **addtocart(target)** - Adiciona ao carrinho com feedback visual, fly animation e toast de confirmação
- **quickview** - Zoom rápido para visualização de produto

### 🔧 Melhorias Técnicas

#### sparkfx-rn
- Todos os efeitos agora usam `react-native-reanimated` para performance nativa
- `useSharedValue` e `useAnimatedStyle` para animações no thread UI
- Suporte a combos complexos: `fx="jelly|glow|addtocart(cart)"`
- Callbacks de animação corrigidos (remoção de type assertions explícitas)
- Build otimizado com sourcemaps

#### Registry
- 13 efeitos registrados (antes: 5)
- Suporte a parâmetros flexíveis (interval, target, etc.)
- Type-safe wrappers para cada efeito

### 📱 Expo Demo Atualizado

O `examples/expo-sparkfx-demo/App.tsx` agora inclui:

- **Seções organizadas**: Básicos, Avançados, E-commerce, Combos
- **Grid de produtos** simulando loja real
- **Múltiplos targets**: cart, wishlist
- **Combos épicos**: jelly|glow|ripple, wobble|addtocart, heartbeat|quickview
- **Design profissional**: cores, espaçamentos, ícones

### 📚 Documentação

#### README.md Expandido
- Tabelas de referência com todos os efeitos e parâmetros
- Exemplos práticos de e-commerce
- Seção de combos poderosos
- API programática com `useFX()`
- Guia de targets avançados

#### Novos Exemplos
```tsx
// Adicionar ao carrinho profissional
<Pressable fx="addtocart(cart)|ripple">
  <Text>Adicionar ao Carrinho</Text>
</Pressable>

// Wishlist com heartbeat
<Pressable fx="heartbeat|addtocart(wishlist)|ripple">
  <Text>❤️ Favoritar</Text>
</Pressable>

// UI destacada
<View fx="pulse|float|glow">
  <Text>⭐ Premium Feature</Text>
</View>
```

### 🧪 Testes

- ✅ 6 testes passando (parseFx, registry, useFxTarget)
- ✅ Build limpo sem erros TypeScript
- ✅ Sourcemaps gerados para debugging

### 📦 Pacotes Atualizados

- `@ranilson/sparkfx-rn`: 0.4.0 → **0.5.0**
- `@ranilson/sparkfx-web`: mantido em 0.5.0 (já atualizado anteriormente)

### 🎯 Foco em E-commerce

Esta versão foi especialmente desenhada para comunidade de desenvolvimento e-commerce:

- Animações de "adicionar ao carrinho" realistas
- Feedback visual rico para ações do usuário
- Efeitos que aumentam conversão (pulse em ofertas, glow em premium)
- Performance nativa para experiência fluida

### 🚀 Próximos Passos

Para usar em seu projeto:

```bash
# Instalar dependências
npm install @ranilson/sparkfx-rn react-native-reanimated react-native-gesture-handler

# Importar no index.js
import '@ranilson/sparkfx-rn/auto';

# Usar em qualquer componente
<Pressable fx="jelly|addtocart(cart)">
  <Text>Adicionar</Text>
</Pressable>
```

---

## v0.4.0 - Web Effects Expansion

### sparkfx-web
- 16 novos efeitos avançados
- Sistema de partículas
- Animações 3D (tilt)
- Efeitos de texto (typewriter, countup)
- Página de documentação interativa

### sparkfx-rn
- 5 efeitos básicos
- FX context provider
- Target system
- Auto-patching de createElement

---

## v0.1.0 - Initial Release

- Conceito inicial
- Proof of concept
- Efeitos básicos (bounce, ripple, shake)
