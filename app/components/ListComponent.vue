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
  status?: 'green' | 'yellow' | 'red'
  needsCheckIn?: boolean
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
  if (item.action.onClick) item.action.onClick(item)
  emit('item-click', item)
}

function getStatusDotStyle(status: string) {
  if (status === 'green') return 'background: var(--color-success); border: 2px solid white;'
  if (status === 'yellow') return 'background: var(--color-warning); border: 2px solid white;'
  if (status === 'red') return 'background: var(--color-error); border: 2px solid white;'
  return 'background: #d1d5db; border: 2px solid white;'
}
</script>

<template>
  <div class="flex flex-col w-full bg-white" role="list">

    <!-- Empty state -->
    <div
      v-if="isEmpty"
      class="py-8 px-4 text-center text-sm"
      style="color: var(--color-text-disabled);"
      role="listitem"
    >
      <slot name="empty">
        <span>{{ emptyMessage || 'No items to display.' }}</span>
      </slot>
    </div>

    <template v-else>

      <!-- Grouped layout -->
      <template v-if="groups">
        <div v-for="group in groups" :key="group.title">

          <div
            class="px-4 pt-4 pb-2 uppercase"
            style="color: var(--color-text-sub-light); font-family: 'Roboto', sans-serif; font-weight: 400; font-size: 14px; line-height: 145%; letter-spacing: normal;"
          >
            {{ group.title }}
          </div>
          <div style="height: 1px; background: var(--color-border, #e5e7eb); margin: 0 0 4px 0;" />

          <component
            v-for="item in group.items"
            :key="String(item.id)"
            :is="item.action?.href ? 'a' : 'div'"
            :href="item.action?.href"
            :target="item.action?.target"
            :rel="item.action?.target === '_blank' ? 'noopener noreferrer' : undefined"
            class="flex items-center gap-4 px-4 py-3 no-underline text-inherit outline-none transition-colors duration-150"
            :class="item.action ? 'cursor-pointer hover:bg-slate-50' : ''"
            role="listitem"
            :tabindex="item.action ? 0 : undefined"
            @click="handleClick(item)"
            @keydown.enter="handleClick(item)"
            @keydown.space.prevent="handleClick(item)"
          >
            <slot name="icon" :item="item">
              <div class="relative shrink-0" style="width: 40px; height: 40px;">
                <div
                  class="rounded-full flex items-center justify-center overflow-hidden text-white absolute inset-0"
                  style="
                    font-size: 16px;
                    font-family: 'Roboto', sans-serif;
                    font-weight: 500;
                    background: var(--color-avatar-bg, #D9D9D9);
                  "
                >
                  <img v-if="item.avatarUrl" :src="item.avatarUrl" class="w-full h-full object-cover" />
                  <span v-else>{{ item.initials }}</span>
                </div>
                <div
                  v-if="item.needsCheckIn"
                  class="absolute inset-0 rounded-full"
                  style="box-shadow: 0 0 0 2px white, 0 0 0 4px var(--color-brand-orange);"
                />
                <span
                  v-if="item.status"
                  class="absolute rounded-full"
                  style="width: 12px; height: 12px; bottom: -2px; right: -2px;"
                  :style="getStatusDotStyle(item.status)"
                />
              </div>
            </slot>

            <div class="flex flex-col flex-1 min-w-0">
              <slot name="label" :item="item">
                <span
                  class="text-sm truncate"
                  style="color: var(--color-text-main); font-family: 'Roboto', sans-serif; font-weight: 400;"
                >{{ item.label }}</span>
              </slot>
              <slot name="sublabel" :item="item">
                <span
                  v-if="item.sublabel"
                  class="text-xs truncate mt-0.5"
                  style="color: var(--color-text-sub-light); font-family: 'Roboto', sans-serif; font-weight: 300;"
                >{{ item.sublabel }}</span>
              </slot>
            </div>

            <div class="shrink-0 flex items-center gap-2">
              <slot name="trailing" :item="item" />
            </div>
          </component>

        </div>
      </template>

      <!-- Flat (non-grouped) layout -->
      <template v-else>
        <component
          v-for="item in items"
          :key="String(item.id)"
          :is="item.action?.href ? 'a' : 'div'"
          :href="item.action?.href"
          :target="item.action?.target"
          :rel="item.action?.target === '_blank' ? 'noopener noreferrer' : undefined"
          class="flex items-center gap-4 px-4 py-3 no-underline text-inherit outline-none transition-colors duration-150"
          :class="item.action ? 'cursor-pointer hover:bg-slate-50' : ''"
          role="listitem"
          :tabindex="item.action ? 0 : undefined"
          @click="handleClick(item)"
          @keydown.enter="handleClick(item)"
          @keydown.space.prevent="handleClick(item)"
        >
          <slot name="icon" :item="item">
            <div class="relative shrink-0" style="width: 40px; height: 40px;">
              <div
                class="rounded-full flex items-center justify-center overflow-hidden text-white absolute inset-0"
                style="
                  font-size: 16px;
                  font-family: 'Roboto', sans-serif;
                  font-weight: 500;
                  background: var(--color-avatar-bg, #D9D9D9);
                "
              >
                <img v-if="item.avatarUrl" :src="item.avatarUrl" class="w-full h-full object-cover" />
                <span v-else>{{ item.initials }}</span>
              </div>
              <div
                v-if="item.needsCheckIn"
                class="absolute inset-0 rounded-full"
                style="box-shadow: 0 0 0 2px white, 0 0 0 4px var(--color-brand-orange);"
              />
              <span
                v-if="item.status"
                class="absolute rounded-full"
                style="width: 12px; height: 12px; bottom: -2px; right: -2px;"
                :style="getStatusDotStyle(item.status)"
              />
            </div>
          </slot>

          <div class="flex flex-col flex-1 min-w-0">
            <slot name="label" :item="item">
              <span
                class="text-sm truncate"
                style="color: var(--color-text-main); font-family: 'Roboto', sans-serif; font-weight: 400;"
              >{{ item.label }}</span>
            </slot>
            <slot name="sublabel" :item="item">
              <span
                v-if="item.sublabel"
                class="text-xs truncate mt-0.5"
                style="color: var(--color-text-sub-light); font-family: 'Roboto', sans-serif; font-weight: 300;"
              >{{ item.sublabel }}</span>
            </slot>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <slot name="trailing" :item="item" />
          </div>
        </component>
      </template>

    </template>
  </div>
</template>