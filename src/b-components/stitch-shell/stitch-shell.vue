<template>
  <SC_Dock data-testid="stitch-dock">
    <SC_DockScroll ref="scrollEl">
      <SC_Tab
        v-for="section in sections"
        :key="section.key"
        class="stitch-tab"
        :class="{ 'is-active': isActive(section) }"
        type="button"
        :aria-label="section.label"
        :aria-current="isActive(section) ? 'page' : undefined"
        @click="onTab(section)"
      >
        <SC_TabGlow v-if="isActive(section)" />
        <component :is="section.icon" />
        <SC_TabLabel>{{ section.label }}</SC_TabLabel>
        <SC_TabBadge v-if="section.badge">{{ badgeText(section.badge) }}</SC_TabBadge>
      </SC_Tab>
    </SC_DockScroll>
  </SC_Dock>

  <SC_Panel
    class="stitch-panel"
    :class="{ 'is-hidden': !visible }"
    role="dialog"
    :aria-label="activeSection?.label"
  >
    <SC_PanelHandle
      type="button"
      :aria-label="activeSection?.label"
      @click="expand"
      @touchstart.passive="onHandleTouchStart"
      @touchend="onHandleTouchEnd"
    />

    <SC_PanelBar>
      <SC_PanelPill>{{ statusText }}</SC_PanelPill>
      <SC_PanelActions>
        <SC_PanelButton type="button" :aria-label="activeSection?.label" @click="expand">
          <FullscreenOutlined />
        </SC_PanelButton>
        <SC_PanelButton type="button" :aria-label="t('common.close')" @click="closeActive">
          <CaretDownOutlined />
        </SC_PanelButton>
      </SC_PanelActions>
    </SC_PanelBar>

    <!-- Стек открытых панелей: переключение без закрытия (как в макете). -->
    <SC_Chips v-if="stackSections.length > 1">
      <SC_Chip
        v-for="item in stackSections"
        :key="item.key"
        class="stitch-chip"
        :class="{ 'is-active': item.key === activeKey }"
        type="button"
        @click="activate(item.key)"
      >
        {{ item.label }}
      </SC_Chip>
    </SC_Chips>

    <SC_PanelBody v-if="activeSection">
      <!--
        shortcut: превью раздела — карточка с переходом, настоящий контент
        раздела появится здесь по одному разделу за итерацию.
      -->
      <SC_SectionCard type="button" @click="expand">
        <SC_SectionIcon><component :is="activeSection.icon" /></SC_SectionIcon>
        <SC_SectionText>
          <SC_SectionTitle>{{ activeSection.label }}</SC_SectionTitle>
        </SC_SectionText>
        <SC_SectionArrow><ArrowUpOutlined /></SC_SectionArrow>
      </SC_SectionCard>
    </SC_PanelBody>
  </SC_Panel>
</template>

<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  ArrowUpOutlined,
  CaretDownOutlined,
  CollectionIcon,
  FullscreenOutlined,
  HeadphonesIcon,
  HomeOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  UserOutlined,
  WalletOutlined,
} from '@/components/icons'
import { useMessengerStore } from '@/b-components/messenger/store'
import { useAuthStore } from '@/blockchain'
import { requireAuth } from '@/composables/use-auth-gate'
import type { Address } from '@/blockchain/types/addresses'
import {
  SC_Dock,
  SC_DockScroll,
  SC_Tab,
  SC_TabGlow,
  SC_TabLabel,
  SC_TabBadge,
  SC_Panel,
  SC_PanelHandle,
  SC_PanelBar,
  SC_PanelPill,
  SC_PanelActions,
  SC_PanelButton,
  SC_Chips,
  SC_Chip,
  SC_PanelBody,
  SC_SectionCard,
  SC_SectionIcon,
  SC_SectionText,
  SC_SectionTitle,
  SC_SectionArrow,
} from './stitch-shell.styled'

type SectionKey = 'home' | 'profile' | 'messages' | 'wallet' | 'collections' | 'audio' | 'video' | 'settings'

interface DockSection {
  key: SectionKey
  label: string
  icon: Component
  badge?: number
  route?: RouteLocationRaw
}

/** Число на значке: больше 99 — «99+». */
function badgeText(badge: number | undefined): string {
  if (!badge || badge <= 0) return ''
  return badge > 99 ? '99+' : String(badge)
}

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const messengerStore = useMessengerStore()
const { totalUnreadCount } = storeToRefs(messengerStore)

/** Стек панелей: последняя открытая показывается, остальные — чипами сверху. */
const stack = ref<SectionKey[]>([])
const visible = ref(false)
const scrollEl = ref<HTMLElement | null>(null)
let touchStartY = 0

const sections = computed<DockSection[]>(() => {
  const address = authStore.address as Address | null
  return [
    { key: 'home', label: t('bottomNav.home'), icon: HomeOutlined, route: { path: '/' } },
    {
      key: 'profile',
      label: t('profile.title'),
      icon: UserOutlined,
      // Гостю профиль недоступен: панель откроется после входа.
      route: address ? { name: 'profile', params: { userName: address } } : undefined,
    },
    {
      key: 'messages',
      label: t('bottomNav.messenger'),
      icon: MessageOutlined,
      badge: totalUnreadCount.value,
    },
    { key: 'wallet', label: t('bottomNav.wallet'), icon: WalletOutlined, route: { path: '/wallets' } },
    {
      key: 'collections',
      label: t('profile.tabs.collections'),
      icon: CollectionIcon,
      route: { path: '/collections' },
    },
    { key: 'audio', label: t('audioSection.title'), icon: HeadphonesIcon, route: { path: '/audio' } },
    {
      key: 'video',
      label: t('videoSection.title'),
      icon: PlayCircleOutlined,
      route: { path: '/video' },
    },
    {
      key: 'settings',
      label: t('settings.title'),
      icon: SettingOutlined,
      route: { path: '/settings' },
    },
  ]
})

const activeKey = computed<SectionKey | null>(() => stack.value[stack.value.length - 1] ?? null)
const activeSection = computed<DockSection | null>(
  () => sections.value.find((s) => s.key === activeKey.value) ?? null
)
const stackSections = computed<DockSection[]>(() =>
  stack.value
    .map((key) => sections.value.find((s) => s.key === key))
    .filter((s): s is DockSection => Boolean(s))
)

/** Что показать в пилюле панели: выбранный раздел, иначе приглашение. */
const statusText = computed<string>(() => activeSection.value?.label ?? t('bottomNav.home'))

// Активное состояние — классами: правила лежат в <style> ниже. Стилизованные
// пропсы здесь не пересчитывались при смене раздела, а класс Vue обновляет всегда.

function isActive(section: DockSection): boolean {
  if (visible.value && activeSection.value) return activeSection.value.key === section.key
  return Boolean(section.route && !('name' in section.route)
    ? section.route.path === route.path
    : false)
}

/** Панель видна и показывает этот раздел. */
function isPanelOpen(key: SectionKey): boolean {
  return visible.value && activeKey.value === key
}

function activate(key: SectionKey): void {
  stack.value = [...stack.value.filter((k) => k !== key), key]
  visible.value = true
}

function openPanel(key: SectionKey): void {
  if (isPanelOpen(key)) {
    visible.value = false
    return
  }
  activate(key)
}

function closeActive(): void {
  stack.value = stack.value.slice(0, -1)
  if (!stack.value.length) visible.value = false
}

function openChats(): void {
  visible.value = false
  if (messengerStore.isFullScreen) {
    messengerStore.isFullScreen = false
    return
  }
  requireAuth(() => {
    messengerStore.isFullScreen = true
  })
}

/** Разворот панели — переход на настоящую страницу раздела. */
function expand(): void {
  const section = activeSection.value
  if (!section) return
  if (section.key === 'messages') {
    openChats()
    return
  }
  if (!section.route) {
    requireAuth(() => openPanel(section.key))
    return
  }
  visible.value = false
  stack.value = []
  void router.push(section.route)
}

function onTab(section: DockSection): void {
  // «Главная» — это лента: панель закрываем, показываем страницу.
  if (section.key === 'home') {
    visible.value = false
    if (route.path !== '/') void router.push('/')
    return
  }
  if (section.key === 'messages') {
    visible.value = false
    if (route.path !== '/') void router.push('/')
    openChats()
    return
  }
  if (!section.route) {
    requireAuth(() => openPanel(section.key))
    return
  }
  openPanel(section.key)
}

function onHandleTouchStart(e: TouchEvent): void {
  touchStartY = e.touches[0]?.clientY ?? 0
}

function onHandleTouchEnd(e: TouchEvent): void {
  const endY = e.changedTouches[0]?.clientY ?? touchStartY
  const dy = endY - touchStartY
  if (dy <= -24) expand()
  else if (dy >= 24) closeActive()
  else expand()
}
</script>

<style>
/* Состояния — обычным CSS, а не инлайновыми стилями: правило проекта
   запрещает :style в шаблонах (CODE_AUDIT §3.1). */
.stitch-tab.is-active {
  color: #4cd7f6;
  background: linear-gradient(180deg, #282a30 0%, #1e1f26 55%, #0c0e14 100%);
  box-shadow:
    0 0 20px rgba(6, 182, 212, 0.55),
    inset 0 1.5px 1px rgba(255, 255, 255, 0.7),
    inset 0 -1px 0 rgba(0, 0, 0, 0.5);
}

.stitch-panel.is-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(32px) scale(0.96);
  max-height: 0;
}

.stitch-chip.is-active {
  border-color: rgba(76, 215, 246, 0.45);
  background: rgba(76, 215, 246, 0.14);
  color: #4cd7f6;
}
</style>
