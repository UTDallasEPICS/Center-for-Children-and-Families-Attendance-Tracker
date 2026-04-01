<script setup lang="ts">
import { computed } from 'vue'

interface ListItemAction {
  onClick?: (item: ListItem) => void
  href?: string
  target?: string
}

interface ListItem {
  id: string | number
  label: string
  sublabel?: string
  initials?: string
  avatarUrl?: string
  status?: 'green' | 'orange' | 'grey'
  badge?: { label: string | number; variant?: string }
  action?: ListItemAction
}

interface ListGroup {
  title: string
  items: ListItem[]
}

const props = defineProps<{
  groups?: ListGroup[]
  items?: ListItem[]
  emptyMessage?: string
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (e: 'item-click', item: ListItem): void
}>()

const isEmpty = computed(() => {
  if (props.groups) return props.groups.every(g => g.items.length === 0)
  return !props.items || props.items.length === 0
})

function handleClick(item: ListItem) {
  if (!item.action) return
  if (item.action.onClick) {
    item.action.onClick(item)
  }
  emit('item-click', item)
}

function getStatusDotClass(status: string) {
  if (status === 'green') return 'bg-green-500'
  if (status === 'orange') return 'bg-orange-400'
  return 'bg-slate-300'
}

function getBadgeClass(variant: string) {
  if (variant === 'success') return 'bg-green-100 text-green-700'
  if (variant === 'warning') return 'bg-yellow-100 text-yellow-700'
  if (variant === 'danger') return 'bg-red-100 text-red-600'
  if (variant === 'info') return 'bg-blue-100 text-blue-700'
  return 'bg-slate-200 text-slate-600'
}
</script>

<template>
  <div
    class="flex flex-col w-full border border-slate-200 rounded-lg bg-white overflow-hidden"
    :aria-label="ariaLabel"
    role="list"
  >

    <div v-if="isEmpty" class="py-8 px-4 text-center text-sm text-slate-500" role="listitem">
      <slot name="empty">
        <span>{{ emptyMessage || 'No items to display.' }}</span>
      </slot>
    </div>

    <template v-else>

      <template v-if="groups">
        <div v-for="group in groups" :key="group.title">

          <div class="px-4 py-2 text-xs font-semibold tracking-widest text-slate-400 uppercase">
            {{ group.title }} {{ group.items.length }}
          </div>

          <component
            v-for="item in group.items"
            :key="item.id"
            :is="item.action?.href ? 'a' : 'div'"
            :href="item.action?.href"
            :target="item.action?.target"
            :rel="item.action?.target === '_blank' ? 'noopener noreferrer' : undefined"
            class="flex items-center gap-3 px-4 py-3 border-b border-slate-100 no-underline text-inherit outline-none transition-colors duration-150"
            :class="item.action ? 'cursor-pointer hover:bg-slate-50' : ''"
            role="listitem"
            :tabindex="item.action ? 0 : undefined"
            @click="handleClick(item)"
            @keydown.enter="handleClick(item)"
            @keydown.space.prevent="handleClick(item)"
          >

            <slot name="icon" :item="item">
              <div class="relative shrink-0">
                <div class="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 overflow-hidden">
                  <img v-if="item.avatarUrl" :src="item.avatarUrl" class="w-full h-full object-cover" />
                  <span v-else>{{ item.initials }}</span>
                </div>
                <span
                  v-if="item.status"
                  class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                  :class="getStatusDotClass(item.status)"
                ></span>
              </div>
            </slot>

            <div class="flex flex-col flex-1 min-w-0">
              <slot name="label" :item="item">
                <span class="text-sm font-medium text-slate-900 truncate">{{ item.label }}</span>
              </slot>
              <slot name="sublabel" :item="item">
                <span v-if="item.sublabel" class="text-xs text-slate-500 truncate">{{ item.sublabel }}</span>
              </slot>
            </div>

            <div class="shrink-0 flex items-center gap-2">
              <slot name="badge" :item="item">
                <span
                  v-if="item.badge"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                  :class="getBadgeClass(item.badge.variant || 'default')"
                >
                  {{ item.badge.label }}
                </span>
              </slot>
              <slot name="trailing" :item="item" />
            </div>

          </component>

        </div>
      </template>

      <template v-else>
        <component
          v-for="item in items"
          :key="item.id"
          :is="item.action?.href ? 'a' : 'div'"
          :href="item.action?.href"
          :target="item.action?.target"
          :rel="item.action?.target === '_blank' ? 'noopener noreferrer' : undefined"
          class="flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 no-underline text-inherit outline-none transition-colors duration-150"
          :class="item.action ? 'cursor-pointer hover:bg-slate-50' : ''"
          role="listitem"
          :tabindex="item.action ? 0 : undefined"
          @click="handleClick(item)"
          @keydown.enter="handleClick(item)"
          @keydown.space.prevent="handleClick(item)"
        >

          <slot name="icon" :item="item">
            <div class="relative shrink-0">
              <div class="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 overflow-hidden">
                <img v-if="item.avatarUrl" :src="item.avatarUrl" class="w-full h-full object-cover" />
                <span v-else>{{ item.initials }}</span>
              </div>
              <span
                v-if="item.status"
                class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                :class="getStatusDotClass(item.status)"
              ></span>
            </div>
          </slot>

          <div class="flex flex-col flex-1 min-w-0">
            <slot name="label" :item="item">
              <span class="text-sm font-medium text-slate-900 truncate">{{ item.label }}</span>
            </slot>
            <slot name="sublabel" :item="item">
              <span v-if="item.sublabel" class="text-xs text-slate-500 truncate">{{ item.sublabel }}</span>
            </slot>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <slot name="badge" :item="item">
              <span
                v-if="item.badge"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                :class="getBadgeClass(item.badge.variant || 'default')"
              >
                {{ item.badge.label }}
              </span>
            </slot>
            <slot name="trailing" :item="item" />
          </div>

        </component>
      </template>

    </template>

  </div>
</template>