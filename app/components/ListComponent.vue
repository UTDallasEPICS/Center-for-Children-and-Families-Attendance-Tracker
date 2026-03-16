<script setup lang="ts">
import { computed } from 'vue'
import type { ListItem } from '../types/list.types'

const props = withDefaults(defineProps<{
  items: ListItem[]
  emptyMessage?: string
  ariaLabel?: string
}>(), {
  emptyMessage: 'No items to display.',
  ariaLabel: 'List',
})

const emit = defineEmits<{
  (e: 'item-click', item: ListItem): void
}>()

const isEmpty = computed(() => props.items.length === 0)

function handleClick(item: ListItem) {
  if (!item.action) return
  item.action.onClick?.(item)
  emit('item-click', item)
}

function badgeClass(variant: string = 'default') {
  const variants: Record<string, string> = {
    default: 'badge--default',
    success: 'badge--success',
    warning: 'badge--warning',
    danger: 'badge--danger',
    info: 'badge--info',
  }
  return variants[variant] ?? variants.default
}
</script>

<template>
  <div class="base-list" :aria-label="ariaLabel" role="list">

    <div v-if="isEmpty" class="base-list__empty" role="listitem">
      <slot name="empty">
        <span>{{ emptyMessage }}</span>
      </slot>
    </div>

    <template v-else>
      <component
        v-for="item in items"
        :key="item.id"
        :is="item.action?.href ? 'a' : 'div'"
        :href="item.action?.href"
        :target="item.action?.target"
        :rel="item.action?.target === '_blank' ? 'noopener noreferrer' : undefined"
        class="base-list__item"
        :class="{ 'base-list__item--interactive': !!item.action }"
        role="listitem"
        :tabindex="item.action ? 0 : undefined"
        @click="handleClick(item)"
        @keydown.enter="handleClick(item)"
        @keydown.space.prevent="handleClick(item)"
      >
        <slot name="icon" :item="item">
          <span v-if="item.icon" class="base-list__icon">{{ item.icon }}</span>
        </slot>

        <div class="base-list__body">
          <slot name="label" :item="item">
            <span class="base-list__label">{{ item.label }}</span>
          </slot>
          <slot name="sublabel" :item="item">
            <span v-if="item.sublabel" class="base-list__sublabel">{{ item.sublabel }}</span>
          </slot>
        </div>

        <div class="base-list__trailing">
          <slot name="badge" :item="item">
            <span v-if="item.badge" class="base-list__badge" :class="badgeClass(item.badge.variant)">
              {{ item.badge.label }}
            </span>
          </slot>
          <slot name="trailing" :item="item" />
        </div>

      </component>
    </template>

  </div>
</template>

<style scoped>
.base-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid var(--list-border-color, #e2e8f0);
  border-radius: var(--list-border-radius, 8px);
  background: var(--list-bg, #ffffff);
  overflow: hidden;
}

.base-list__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--list-border-color, #e2e8f0);
  text-decoration: none;
  color: inherit;
  background: transparent;
  transition: background 0.15s ease;
  outline: none;
}

.base-list__item:last-child {
  border-bottom: none;
}

.base-list__item--interactive {
  cursor: pointer;
}

.base-list__item--interactive:hover,
.base-list__item--interactive:focus-visible {
  background: var(--list-item-hover-bg, #f8fafc);
}

.base-list__item--interactive:focus-visible {
  box-shadow: inset 0 0 0 2px var(--list-focus-color, #3b82f6);
}

.base-list__icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border-radius: 50%;
  background: var(--list-icon-bg, #f1f5f9);
}

.base-list__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.base-list__label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--list-label-color, #0f172a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.base-list__sublabel {
  font-size: 0.8125rem;
  color: var(--list-sublabel-color, #64748b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.base-list__trailing {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.base-list__badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge--default { background: #e2e8f0; color: #475569; }
.badge--success { background: #dcfce7; color: #16a34a; }
.badge--warning { background: #fef9c3; color: #ca8a04; }
.badge--danger  { background: #fee2e2; color: #dc2626; }
.badge--info    { background: #dbeafe; color: #2563eb; }

.base-list__empty {
  padding: 32px 16px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--list-sublabel-color, #64748b);
}
</style>