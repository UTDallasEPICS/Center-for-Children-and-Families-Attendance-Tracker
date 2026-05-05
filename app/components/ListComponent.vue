<!--
  ListComponent.vue

  Props:
  - groups: ListGroup[]       — Pass this for a grouped list with section headers.
  - items: ListItem[]         — Pass this for a flat list with no grouping. Use either groups OR items, not both.
  - emptyMessage: string      — Custom message when the list is empty. Defaults to 'No items to display.'

  ListItem fields:
  - id: string | number       — Unique identifier for each item.
  - label: string             — Primary text shown for the item.
  - sublabel: string          — Secondary text shown below the label.
  - initials: string          — Initials shown in the avatar circle when no image is provided.
  - avatarUrl: string         — Image URL for the avatar. Overrides initials if provided.
  - status: 'green' | 'yellow' | 'red'  — Shows an attendance dot. green = good, yellow = warning, red = critical.
  - needsCheckIn: boolean     — Shows an orange ring around the avatar when true.
  - action.onClick: function  — Click handler for the item.
  - action.href: string       — Makes the item a link.
  - action.target: string     — Link target e.g. '_blank' to open in new tab.

  Slots:
  - #icon     — Override the avatar area entirely.
  - #label    — Override the label text.
  - #sublabel — Override the sublabel text.
  - #trailing — Add content to the right side of each item e.g. a button or icon.
  - #empty    — Override the empty state message.
-->

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
  if (item.action.onClick) {
    item.action.onClick(item)
  }
  emit('item-click', item)
}

function getStatusDotStyle(status: string) {
  if (status === 'green') return 'background: var(--color-success); border: 2px solid white;'
  if (status === 'yellow') return 'background: var(--color-warning); border: 2px solid white;'
  if (status === 'red') return 'background: var(--color-error); border: 2px solid white;'
  return 'background: #d1d5db; border: 2px solid white;'
}

function getAvatarRingStyle(needsCheckIn?: boolean) {
  return needsCheckIn ? 'outline: 2.5px solid var(--color-brand-orange); outline-offset: 3px;' : ''
}
</script>

<template>
  <div
    class="flex flex-col w-full bg-white"
    role="list"
  >

    <div v-if="isEmpty" class="py-8 px-4 text-center text-sm" style="color: var(--color-text-disabled);" role="listitem">
      <slot name="empty">
        <span>{{ emptyMessage || 'No items to display.' }}</span>
      </slot>
    </div>

    <template v-else>

      <template v-if="groups">
        <div v-for="group in groups" :key="group.title">

          <div class="px-4 py-2 flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase" style="color: var(--color-text-disabled);">
            {{ group.title }}
            <span class="w-1 h-1 rounded-full inline-block" style="background: var(--color-text-disabled);"></span>
            {{ group.items.length }}
          </div>

          <component
            v-for="item in group.items"
            :key="String(item.id)"
            :is="item.action?.href ? 'a' : 'div'"
            :href="item.action?.href"
            :target="item.action?.target"
            :rel="item.action?.target === '_blank' ? 'noopener noreferrer' : undefined"
            class="flex items-center gap-3 px-4 py-3 no-underline text-inherit outline-none transition-colors duration-150"
            :class="item.action ? 'cursor-pointer hover:bg-slate-50' : ''"
            role="listitem"
            :tabindex="item.action ? 0 : undefined"
            @click="handleClick(item)"
            @keydown.enter="handleClick(item)"
            @keydown.space.prevent="handleClick(item)"
          >

            <slot name="icon" :item="item">
              <div class="relative shrink-0">
                <div
                  class="rounded-full bg-slate-300 flex items-center justify-center font-semibold text-white overflow-hidden"
                  style="width: 52px; height: 52px; font-size: 18px;"
                  :style="getAvatarRingStyle(item.needsCheckIn)"
                >
                  <img v-if="item.avatarUrl" :src="item.avatarUrl" class="w-full h-full object-cover" />
                  <span v-else>{{ item.initials }}</span>
                </div>
                <span
                  v-if="item.status"
                  class="absolute bottom-0.5 -right-1 w-3 h-3 rounded-full"
                  :style="getStatusDotStyle(item.status)"
                ></span>
              </div>
            </slot>

            <div class="flex flex-col flex-1 min-w-0">
              <slot name="label" :item="item">
                <span class="text-sm font-medium truncate" style="color: var(--color-text-main);">{{ item.label }}</span>
              </slot>
              <slot name="sublabel" :item="item">
                <span v-if="item.sublabel" class="text-xs truncate mt-0.5" style="color: var(--color-text-sub-light);">{{ item.sublabel }}</span>
              </slot>
            </div>

            <div class="shrink-0 flex items-center gap-2">
              <slot name="trailing" :item="item" />
            </div>

          </component>

        </div>
      </template>

      <template v-else>
        <component
          v-for="item in items"
          :key="String(item.id)"
          :is="item.action?.href ? 'a' : 'div'"
          :href="item.action?.href"
          :target="item.action?.target"
          :rel="item.action?.target === '_blank' ? 'noopener noreferrer' : undefined"
          class="flex items-center gap-3 px-4 py-3 no-underline text-inherit outline-none transition-colors duration-150"
          :class="item.action ? 'cursor-pointer hover:bg-slate-50' : ''"
          role="listitem"
          :tabindex="item.action ? 0 : undefined"
          @click="handleClick(item)"
          @keydown.enter="handleClick(item)"
          @keydown.space.prevent="handleClick(item)"
        >

          <slot name="icon" :item="item">
            <div class="relative shrink-0">
              <div
                class="rounded-full bg-slate-300 flex items-center justify-center font-semibold text-white overflow-hidden"
                style="width: 52px; height: 52px; font-size: 18px;"
                :style="getAvatarRingStyle(item.needsCheckIn)"
              >
                <img v-if="item.avatarUrl" :src="item.avatarUrl" class="w-full h-full object-cover" />
                <span v-else>{{ item.initials }}</span>
              </div>
              <span
                v-if="item.status"
                class="absolute bottom-0.5 -right-1 w-3 h-3 rounded-full"
                :style="getStatusDotStyle(item.status)"
              ></span>
            </div>
          </slot>

          <div class="flex flex-col flex-1 min-w-0">
            <slot name="label" :item="item">
              <span class="text-sm font-medium truncate" style="color: var(--color-text-main);">{{ item.label }}</span>
            </slot>
            <slot name="sublabel" :item="item">
              <span v-if="item.sublabel" class="text-xs truncate mt-0.5" style="color: var(--color-text-sub-light);">{{ item.sublabel }}</span>
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