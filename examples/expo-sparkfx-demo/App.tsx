/** @jsxRuntime classic */
import React, { useState } from 'react';
import { Text, View, Pressable, StyleSheet, ScrollView } from 'react-native';
// @ts-ignore: resolvido em tempo de execução pelo workspace npm
import { useFxTarget } from '@ranilson/sparkfx-rn';

export default function App(){
  const [currentScreen, setCurrentScreen] = useState('home');
  const cartTarget = useFxTarget('cart');
  const wishlistTarget = useFxTarget('wishlist');
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>⚡ SparkFX v0.6</Text>
        <View style={styles.headerActions}>
          <View {...wishlistTarget} style={styles.iconBtn}><Text style={styles.iconText}>❤️</Text></View>
          <View {...cartTarget} style={styles.iconBtn}><Text style={styles.iconText}>🛒</Text></View>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        <Pressable 
          fx="bounce|ripple"
          onPress={() => setCurrentScreen('home')} 
          style={[styles.tab, currentScreen === 'home' && styles.tabActive]}
        >
          <Text style={styles.tabText}>🏠 Home</Text>
        </Pressable>
        <Pressable 
          fx="bounce|ripple"
          onPress={() => setCurrentScreen('physics')} 
          style={[styles.tab, currentScreen === 'physics' && styles.tabActive]}
        >
          <Text style={styles.tabText}>⚛️ Physics</Text>
        </Pressable>
        <Pressable 
          fx="bounce|ripple"
          onPress={() => setCurrentScreen('3d')} 
          style={[styles.tab, currentScreen === '3d' && styles.tabActive]}
        >
          <Text style={styles.tabText}>🎲 3D</Text>
        </Pressable>
        <Pressable 
          fx="bounce|ripple"
          onPress={() => setCurrentScreen('premium')} 
          style={[styles.tab, currentScreen === 'premium' && styles.tabActive]}
        >
          <Text style={styles.tabText}>💎 Premium</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {currentScreen === 'home' && <HomeScreen cartTarget={cartTarget} wishlistTarget={wishlistTarget} />}
        {currentScreen === 'physics' && <PhysicsScreen />}
        {currentScreen === '3d' && <ThreeDScreen />}
        {currentScreen === 'premium' && <PremiumScreen />}
      </ScrollView>
    </View>
  );
}

function HomeScreen({ cartTarget, wishlistTarget }: any) {
  return (
    <>
      <Text style={styles.sectionTitle}>🎭 Efeitos Básicos</Text>
      <Pressable fx="bounce|ripple" style={styles.btn}>
        <Text style={styles.btnText}>Bounce + Ripple</Text>
      </Pressable>
      <Pressable fx="shake" style={styles.btn}>
        <Text style={styles.btnText}>Shake</Text>
      </Pressable>
      <Pressable fx="presspop" style={styles.btn}>
        <Text style={styles.btnText}>PressPop</Text>
      </Pressable>
      <Pressable fx="bounce|ripple|fly(cart)" style={styles.btn}>
        <Text style={styles.btnText}>Fly to Cart</Text>
      </Pressable>
      <Pressable fx="toast(text='Salvo!', t=1400)" style={styles.btn}>
        <Text style={styles.btnText}>Toast Message</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>✨ Efeitos Avançados</Text>
      <Pressable fx="jelly" style={styles.btn}>
        <Text style={styles.btnText}>Jelly Bounce</Text>
      </Pressable>
      <Pressable fx="wobble" style={styles.btn}>
        <Text style={styles.btnText}>Wobble</Text>
      </Pressable>
      <Pressable fx="sparkle(color='#f5d0fe')" style={styles.btn}>
        <Text style={styles.btnText}>Sparkle</Text>
      </Pressable>
      <Pressable fx="rings(color='#93c5fd')" style={styles.btn}>
        <Text style={styles.btnText}>Rings</Text>
      </Pressable>
      <Pressable fx="fireworks(color='#fde68a')" style={styles.btn}>
        <Text style={styles.btnText}>Fireworks</Text>
      </Pressable>
      
      <View fx="pulse" style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Oferta Especial</Text>
        <Text style={styles.cardText}>50% OFF - Apenas hoje!</Text>
      </View>

      <View fx="glow" style={styles.card}>
        <Text style={styles.cardTitle}>⭐ Premium</Text>
        <Text style={styles.cardText}>Recurso exclusivo</Text>
      </View>

      <View fx="float" style={styles.card}>
        <Text style={styles.cardTitle}>🎈 Float Animation</Text>
        <Text style={styles.cardText}>Flutuando suavemente</Text>
      </View>

      <View fx="heartbeat" style={styles.card}>
        <Text style={styles.cardTitle}>💗 Heartbeat</Text>
        <Text style={styles.cardText}>Batimento cardíaco</Text>
      </View>

      <Text style={styles.sectionTitle}>🛒 E-commerce Effects</Text>
      
      <View style={styles.productGrid}>
        <Pressable fx="addtocart(cart)|ripple" style={styles.product}>
          <Text style={styles.productEmoji}>👟</Text>
          <Text style={styles.productName}>Tênis</Text>
          <Text style={styles.productPrice}>R$ 299</Text>
        </Pressable>

        <Pressable fx="addtocart(cart)|ripple" style={styles.product}>
          <Text style={styles.productEmoji}>👕</Text>
          <Text style={styles.productName}>Camiseta</Text>
          <Text style={styles.productPrice}>R$ 89</Text>
        </Pressable>

        <Pressable fx="addtocart(wishlist)|ripple" style={styles.product}>
          <Text style={styles.productEmoji}>🎧</Text>
          <Text style={styles.productName}>Fone</Text>
          <Text style={styles.productPrice}>R$ 199</Text>
        </Pressable>

        <Pressable fx="quickview|ripple" style={styles.product}>
          <Text style={styles.productEmoji}>⌚</Text>
          <Text style={styles.productName}>Relógio</Text>
          <Text style={styles.productPrice}>R$ 599</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>🎪 Combos Épicos</Text>
      <Pressable fx="jelly|glow|ripple" style={[styles.btn, styles.btnPrimary]}>
        <Text style={styles.btnText}>🚀 Mega Combo</Text>
      </Pressable>

      <Pressable fx="presspop|sparkle|rings" style={[styles.btn, styles.btnDanger]}>
        <Text style={styles.btnText}>✨ Spark Pop Combo</Text>
      </Pressable>

      <Pressable fx="wobble|addtocart(cart)" style={[styles.btn, styles.btnSuccess]}>
        <Text style={styles.btnText}>✅ Comprar Agora</Text>
      </Pressable>
    </>
  );
}

function PhysicsScreen() {
  return (
    <>
      <Text style={styles.screenTitle}>⚛️ PHYSICS LAB</Text>
      <Text style={styles.screenSubtitle}>Física realista de nível Harvard</Text>

      <Pressable fx="gravity" style={[styles.btn, styles.btnPhysics]}>
        <Text style={styles.btnText}>🌍 GRAVITY</Text>
        <Text style={styles.btnHint}>Queda com gravidade real</Text>
      </Pressable>

      <Pressable fx="spring" style={[styles.btn, styles.btnPhysics]}>
        <Text style={styles.btnText}>🎯 SPRING PHYSICS</Text>
        <Text style={styles.btnHint}>Física de mola avançada</Text>
      </Pressable>

      <Pressable fx="friction" style={[styles.btn, styles.btnPhysics]}>
        <Text style={styles.btnText}>� FRICTION</Text>
        <Text style={styles.btnHint}>Arrasto com fricção</Text>
      </Pressable>

      <Pressable fx="inertia" style={[styles.btn, styles.btnPhysics]}>
        <Text style={styles.btnText}>�🚀 INERTIA</Text>
        <Text style={styles.btnHint}>Movimento com inércia</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>⚡ Combos de Física</Text>
      <Pressable fx="gravity|ripple" style={[styles.btn, styles.btnCombo]}>
        <Text style={styles.btnText}>Gravity + Ripple</Text>
      </Pressable>

      <Pressable fx="spring|glow" style={[styles.btn, styles.btnCombo]}>
        <Text style={styles.btnText}>Spring + Glow</Text>
      </Pressable>
    </>
  );
}

function ThreeDScreen() {
  return (
    <>
      <Text style={styles.screenTitle}>🎲 3D TRANSFORMS</Text>
      <Text style={styles.screenSubtitle}>Transformações 3D impressionantes</Text>

      <Pressable fx="rotate3d" style={[styles.btn, styles.btn3D]}>
        <Text style={styles.btnText}>🌀 ROTATE 3D</Text>
        <Text style={styles.btnHint}>Rotação completa em 3 eixos</Text>
      </Pressable>

      <Pressable fx="flipcard" style={[styles.btn, styles.btn3D]}>
        <Text style={styles.btnText}>🃏 FLIP CARD</Text>
        <Text style={styles.btnHint}>Virar carta em 3D</Text>
      </Pressable>

      <View fx="wave3d" style={[styles.card, styles.card3D]}>
        <Text style={styles.cardTitle}>🌊 WAVE 3D</Text>
        <Text style={styles.cardText}>Onda tridimensional contínua</Text>
      </View>

      <Pressable fx="tilt" style={[styles.btn, styles.btn3D]}>
        <Text style={styles.btnText}>📐 PERSPECTIVE TILT</Text>
        <Text style={styles.btnHint}>Inclinação com perspectiva</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>✨ Combos 3D</Text>
      <Pressable fx="rotate3d|neonglow" style={[styles.btn, styles.btnCombo]}>
        <Text style={styles.btnText}>3D Rotation + Neon</Text>
      </Pressable>

      <Pressable fx="flipcard|ripple" style={[styles.btn, styles.btnCombo]}>
        <Text style={styles.btnText}>Flip + Ripple</Text>
      </Pressable>
    </>
  );
}

function PremiumScreen() {
  return (
    <>
      <Text style={styles.screenTitle}>💎 PREMIUM EFFECTS</Text>
      <Text style={styles.screenSubtitle}>Efeitos exclusivos de nível Harvard</Text>

      <Pressable fx="elastic" style={[styles.btn, styles.btnPremium]}>
        <Text style={styles.btnText}>🎯 ELASTIC SCALE</Text>
        <Text style={styles.btnHint}>Escala elástica com overshoot</Text>
      </Pressable>

      <View fx="neonglow" style={[styles.card, styles.cardPremium]}>
        <Text style={styles.cardTitle}>💡 NEON GLOW</Text>
        <Text style={styles.cardText}>Brilho neon pulsante contínuo</Text>
      </View>

      <Pressable fx="magnetic" style={[styles.btn, styles.btnPremium]}>
        <Text style={styles.btnText}>🧲 MAGNETIC HOVER</Text>
        <Text style={styles.btnHint}>Atração magnética (pressione)</Text>
      </Pressable>

      <Pressable fx="quantum" style={[styles.btn, styles.btnPremium]}>
        <Text style={styles.btnText}>⚛️ QUANTUM BLUR</Text>
        <Text style={styles.btnHint}>Blur quântico com fade</Text>
      </Pressable>

      <Pressable fx="liquid" style={[styles.btn, styles.btnPremium]}>
        <Text style={styles.btnText}>💧 LIQUID SWIPE</Text>
        <Text style={styles.btnHint}>Transição líquida suave</Text>
      </Pressable>

      <Pressable fx="explosion" style={[styles.btn, styles.btnPremium]}>
        <Text style={styles.btnText}>💥 PARTICLE EXPLOSION</Text>
        <Text style={styles.btnHint}>Explosão de partículas</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>🌟 Ultra Combos Premium</Text>
      <Pressable fx="elastic|neonglow|ripple" style={[styles.btn, styles.btnUltra]}>
        <Text style={styles.btnText}>🔥 MEGA ULTRA COMBO</Text>
      </Pressable>

      <Pressable fx="magnetic|quantum|glow" style={[styles.btn, styles.btnUltra]}>
        <Text style={styles.btnText}>⚡ QUANTUM MAGNETIC</Text>
      </Pressable>

      <Pressable fx="liquid|explosion|fly(cart)" style={[styles.btn, styles.btnUltra]}>
        <Text style={styles.btnText}>🚀 LIQUID EXPLOSION</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0b0d10' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#0b0d10',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f2e'
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12
  },
  logo: { 
    color: 'white', 
    fontSize: 24, 
    fontWeight: '800' 
  },
  iconBtn: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#141820',
    borderWidth: 1,
    borderColor: '#1a1f2e'
  },
  iconText: {
    fontSize: 20
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0b0d10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f2e',
    gap: 8
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#141820',
    alignItems: 'center'
  },
  tabActive: {
    backgroundColor: '#5b21b6',
    borderWidth: 1,
    borderColor: '#7c3aed'
  },
  tabText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700'
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20
  },
  screenTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8
  },
  screenSubtitle: {
    color: '#8b92a4',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20
  },
  sectionTitle: {
    color: '#8b92a4',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  btn: { 
    marginVertical: 6, 
    padding: 16, 
    borderRadius: 12, 
    backgroundColor: '#141820',
    borderWidth: 1,
    borderColor: '#1a1f2e'
  },
  btnHint: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4
  },
  btnPrimary: {
    backgroundColor: '#5b21b6',
    borderColor: '#7c3aed'
  },
  btnSuccess: {
    backgroundColor: '#065f46',
    borderColor: '#059669'
  },
  btnDanger: {
    backgroundColor: '#991b1b',
    borderColor: '#dc2626'
  },
  btnPhysics: {
    backgroundColor: '#1e3a8a',
    borderColor: '#3b82f6'
  },
  btn3D: {
    backgroundColor: '#7c2d12',
    borderColor: '#f97316'
  },
  btnPremium: {
    backgroundColor: '#831843',
    borderColor: '#ec4899'
  },
  btnCombo: {
    backgroundColor: '#164e63',
    borderColor: '#06b6d4'
  },
  btnUltra: {
    backgroundColor: '#581c87',
    borderColor: '#a855f7',
    borderWidth: 2
  },
  btnText: { 
    color: 'white', 
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center'
  },
  card: {
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#141820',
    borderWidth: 1,
    borderColor: '#1a1f2e'
  },
  card3D: {
    backgroundColor: '#292524',
    borderColor: '#f97316'
  },
  cardPremium: {
    backgroundColor: '#3f1d28',
    borderColor: '#ec4899'
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6
  },
  cardText: {
    color: '#8b92a4',
    fontSize: 14
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 8
  },
  product: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#141820',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    alignItems: 'center'
  },
  productEmoji: {
    fontSize: 48,
    marginBottom: 8
  },
  productName: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4
  },
  productPrice: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '800'
  }
});
