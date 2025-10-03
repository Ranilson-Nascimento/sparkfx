
# ⚡ SparkFX

**Animações profissionais para React Native e Web com foco em E-commerce**

[![npm version](https://img.shields.io/npm/v/@ranilson/sparkfx-rn.svg)](https://www.npmjs.com/package/@ranilson/sparkfx-rn)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey)]()

## 🎯 O que é SparkFX?

SparkFX é uma biblioteca de animações **plug-and-play** que adiciona efeitos visuais profissionais ao seu app com **uma linha de código**. Perfeito para e-commerce, apps sociais e qualquer interface que precise de feedback visual rico.

Agora com paridade RN/Expo dos efeitos mais recentes do Web: `presspop`, `sparkle`, `rings`, `fireworks`.

```tsx
// Antes
<Pressable onPress={addToCart}>
  <Text>Adicionar ao Carrinho</Text>
</Pressable>

// Depois (com SparkFX)
<Pressable fx="jelly|addtocart(cart)|ripple">
  <Text>Adicionar ao Carrinho</Text>
</Pressable>
```

**Resultado**: Jelly bounce → Item voa até o carrinho → Ripple visual → Toast de confirmação 🚀

---

## ✨ Features

- ✅ **25+ animações** prontas (bounce, jelly, wobble, pulse, glow, fly, particles, etc.)
- ✅ **Zero configuração** - Um import e está pronto
- ✅ **Performance nativa** com React Native Reanimated
- ✅ **Cross-platform** - iOS, Android e Web
- ✅ **E-commerce ready** - Efeitos específicos para lojas (addtocart, quickview, wishlist)
- ✅ **Composição flexível** - Combine efeitos com `|`
- ✅ **TypeScript** - Tipos completos incluídos
- ✅ **Testado** - 6 testes passando com Vitest

---

## 📦 Estrutura do Projeto

```
sparkfx/
├── packages/
│   ├── sparkfx-rn/          # React Native package
│   └── sparkfx-web/         # Web bundle (standalone)
├── examples/
│   └── expo-sparkfx-demo/   # Demo completo para Expo/RN
├── docs/
│   └── index.html           # Documentação interativa (GitHub Pages)
├── CHANGELOG.md             # Histórico de versões
├── QUICKSTART.md            # Guia rápido para começar
└── README.md                # Este arquivo
```

---

## 🚀 Quick Start

### React Native / Expo

```bash
# 1. Instalar
npm install @ranilson/sparkfx-rn react-native-reanimated react-native-gesture-handler

# 2. Configurar (index.js ou App.tsx)
import '@ranilson/sparkfx-rn/auto';

# 3. Usar
import { useFxTarget } from '@ranilson/sparkfx-rn';

export default function App() {
  const cart = useFxTarget('cart');
  
  return (
    <>
      <Pressable fx="addtocart(cart)">
        <Text>Comprar</Text>
      </Pressable>
      
      <View {...cart}>
        <Text>🛒</Text>
      </View>
    </>
  );
}
```

### Web (Standalone)

```html
<!-- 1. Incluir script -->
<script src="https://unpkg.com/@ranilson/sparkfx-web"></script>

<!-- 2. Usar -->
<button fx="jelly|ripple">Clique Aqui</button>
<div fx="pulse|glow">Oferta Especial!</div>
```

📖 **[Ver guia completo](QUICKSTART.md)**

---

## 🎨 Efeitos Disponíveis

### Interação (Pressionar)
- `bounce` - Scale feedback
- `ripple` - Onda de toque
- `shake` - Vibração
- `presspop` - Pop rápido na pressão
- `jelly` - Bounce elástico
- `wobble` - Balanço lateral

### Ênfase Visual (Contínuo)
- `pulse` - Pulsação
- `glow` - Brilho animado
- `float` - Flutuação
- `heartbeat` - Batimento

### E-commerce
- `addtocart(target)` - Voa até carrinho + feedback
- `quickview` - Zoom de visualização
- `fly(target)` - Voa para qualquer target
- `toast(text)` - Mensagem de confirmação

### Avançados (Web)
- `particles` - Sistema de partículas
- `spiral` - Espiral 3D
- `glitch` - Efeito glitch
- `tilt` - 3D perspective
- `typewriter` - Digitação
- `countup` - Contador animado
- `stagger` - Animação em cascata
- `sparkle` - Partículas cintilantes (trigger)
- `rings` - Anéis concêntricos (trigger)
- `fireworks` - Fogos de artifício (trigger)

📚 **[Documentação completa por pacote](packages/sparkfx-rn/README.md)**

---

## 🛒 Casos de Uso Reais

### Loja Virtual Completa

```tsx
import { useFxTarget } from '@ranilson/sparkfx-rn';

export default function Shop() {
  const cart = useFxTarget('cart');
  const wishlist = useFxTarget('wishlist');
  
  return (
    <ScrollView>
      {/* Header com ícones animados */}
      <View fx="float">
        <Text>⚡ Loja SparkFX</Text>
      </View>
      
      <View {...cart}><Text>🛒 {items}</Text></View>
      <View {...wishlist}><Text>❤️ {favorites}</Text></View>
      
      {/* Ofertas destacadas */}
      <View fx="pulse|glow">
        <Text>🔥 50% OFF - Hoje!</Text>
      </View>
      
      {/* Grid de produtos */}
      {products.map(product => (
        <Pressable 
          key={product.id}
          fx="addtocart(cart)|ripple"
        >
          <Image source={product.image} />
          <Text>{product.name}</Text>
          <Text>${product.price}</Text>
        </Pressable>
      ))}
      
      {/* CTA épico */}
      <Pressable fx="jelly|glow|wobble">
        <Text>🚀 FINALIZAR COMPRA</Text>
      </Pressable>
    </ScrollView>
  );
}
```

**Resultado**: Loja completa com animações profissionais em ~50 linhas.

---

## 📱 Ver Demo Ao Vivo

### Expo/React Native
```bash
cd examples/expo-sparkfx-demo
npm install
npm start
```

### Web
Abra `docs/index.html` no navegador.
Se preferir um servidor local, acesse: http://localhost:4173/docs/

---

## 🧪 Desenvolvimento

### Rodar testes
```bash
cd packages/sparkfx-rn
npm install
npm test  # 6 testes passando
```

### Build
```bash
npm run build  # Gera dist/ com CJS, ESM e .d.ts
```

### Watch mode
```bash
npm run dev  # Rebuild automático
```

---

## 📖 Documentação

- **[Quick Start Guide](QUICKSTART.md)** - Setup em 5 minutos
- **[React Native README](packages/sparkfx-rn/README.md)** - API completa RN
- **[Web README](packages/sparkfx-web/README.md)** - API Web
- **[Changelog](CHANGELOG.md)** - Histórico de versões
- **[Demo Interativo](http://localhost:4173/docs/)** - Todos os efeitos ao vivo

---

## 🚀 Publicar

### NPM (React Native)
```bash
cd packages/sparkfx-rn
npm run build
npm run test
npm publish --access public
```

### GitHub Pages (Web)
1. Habilite GitHub Pages no repositório
2. Aponte para a pasta `docs/`
3. Acesse `https://Ranilson-Nascimento.github.io/sparkfx/`

---

## 🤝 Contribuir

Contribuições são bem-vindas! Para começar:

1. Fork o repo
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit: `git commit -am 'Add nova animação'`
4. Push: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📊 Stats

- **30+ animações** prontas
- **60 FPS** performance nativa
- **~35KB** bundle size (gzipped)
- **100%** TypeScript
- **6/6** testes passando

---

## 📄 Licença

MIT © Ranilson

---

## 🌟 Star History

Se SparkFX te ajudou, considere dar uma ⭐ no GitHub!

---

**Feito com ❤️ para a comunidade de desenvolvimento**


