<template>
  <div>
    <!-- Hamburger Icon Button -->
    <button 
      @click="toggleMenu"
      class="menu-icon-button"
      :class="{ 'active': isOpen }"
      aria-label="Toggle menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay -->
    <div 
      v-if="isOpen"
      class="menu-overlay"
      @click="closeMenu"
    ></div>

    <!-- Menu Panel -->
    <div 
      class="menu-panel"
      :class="{ 'open': isOpen }"
    >
      <div class="menu-header">
        <h2 class="menu-title">Menu</h2>
      </div>
      
      <nav class="menu-nav">
        <NuxtLink 
          to="/"
          @click="closeMenu"
          class="menu-item"
          :class="{ 'active': isActiveRoute('/') }"
        >
          <span class="menu-item-text">Attendance Dashboard</span>
          <span v-if="isActiveRoute('/')" class="menu-item-indicator">●</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/participant-checkin"
          @click="closeMenu"
          class="menu-item"
          :class="{ 'active': isActiveRoute('/participant-checkin') }"
        >
          <span class="menu-item-text">Participant Check-In</span>
          <span v-if="isActiveRoute('/participant-checkin')" class="menu-item-indicator">●</span>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const isActiveRoute = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.menu-icon-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1000;
  position: relative;
}

.menu-icon-button span {
  display: block;
  width: 28px;
  height: 4px;
  background: white;
  margin: 4px 0;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.menu-icon-button.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.menu-icon-button.active span:nth-child(2) {
  opacity: 0;
}

.menu-icon-button.active span:nth-child(3) {
  transform: rotate(-45deg) translate(8px, -8px);
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s ease;
}

.menu-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 280px;
  max-width: 85%;
  height: 100%;
  background: white;
  z-index: 999;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  overflow-y: auto;
}

.menu-panel.open {
  right: 0;
}

.menu-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  background: #00593f;
  color: white;
}

.menu-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

.menu-nav {
  padding: 20px 0;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s ease;
  border-left: 4px solid transparent;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item.active {
  background-color: #f0f8f5;
  border-left-color: #00593f;
  color: #00593f;
  font-weight: 600;
}

.menu-item-text {
  font-size: 1rem;
}

.menu-item-indicator {
  color: #00593f;
  font-size: 0.75rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

