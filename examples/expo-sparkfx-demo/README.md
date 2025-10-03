# SparkFX Expo Demo App

Demo app completo com **28+ efeitos premium** organizados em 4 categorias.

## 🚀 Quick Start

```bash
# Instalar dependências (já feito!)
npm install

# Iniciar Expo
npm start

# Ou diretamente no dispositivo
npm run android  # Android
npm run ios      # iOS
```

## 📱 Estrutura do App

### 🏠 Home
- Efeitos básicos (bounce, ripple, shake, fly, toast)
- Efeitos avançados (jelly, wobble, pulse, glow, float, heartbeat)
- E-commerce (addtocart, quickview)
- Combos épicos

### ⚛️ Physics Lab
- `gravity` - Gravidade realista com queda
- `spring` - Física de mola avançada
- `friction` - Arrasto com fricção
- `inertia` - Movimento com inércia

### 🎲 3D Transforms
- `rotate3d` - Rotação completa em 3 eixos
- `flipcard` - Virar carta 3D
- `wave3d` - Onda 3D contínua
- `tilt` - Perspectiva com inclinação

### 💎 Premium Effects
- `elastic` - Escala elástica com overshoot
- `neonglow` - Brilho neon pulsante
- `magnetic` - Atração magnética
- `quantum` - Blur quântico
- `liquid` - Transição líquida
- `explosion` - Explosão de partículas

## 🔥 Ultra Combos

```tsx
fx="elastic|neonglow|ripple"      // MEGA ULTRA COMBO
fx="magnetic|quantum|glow"         // QUANTUM MAGNETIC
fx="liquid|explosion|fly(cart)"   // LIQUID EXPLOSION
fx="rotate3d|neonglow"            // 3D NEON ROTATION
```

## 📦 Dependências

- `expo` ~51.0.0
- `react` 18.2.0
- `react-native` 0.74.0
- `react-native-reanimated` ~3.10.0
- `react-native-gesture-handler` ~2.16.0
- `@ranilson/sparkfx-rn` v0.6.0

## 🎯 Recursos

- ✅ 4 telas com navegação por tabs
- ✅ 28+ efeitos demonstrados
- ✅ Exemplos práticos de e-commerce
- ✅ Ultra combos premium
- ✅ Dark theme profissional
- ✅ 60 FPS garantido

## 🎨 Personalização

Edite `App.tsx` para adicionar seus próprios exemplos:

```tsx
<Pressable fx="seu-efeito-aqui|ripple">
  <Text>Clique aqui</Text>
</Pressable>
```

---

**⚡ Powered by SparkFX v0.6.0 — Animations of Harvard Level**
