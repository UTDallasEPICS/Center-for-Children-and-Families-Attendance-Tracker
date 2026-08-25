# Component Documentation

---

## Checkbox

Native `<input type="checkbox">` with custom circular UI.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `modelValue` | `boolean` | yes | Checked state (`v-model`) |
| `label` | `string` | no | Label text |
| `disabled` | `boolean` | no | Disables interaction |
| `id` | `string` | no | Defaults to auto-generated |
| `name` | `string` | no | For form submission |
| `value` | `string` | no | For form submission |

### Example

```vue
<Checkbox v-model="agreed" label="I agree to the terms" />

<!-- Disabled states -->
<Checkbox :model-value="false" :disabled="true" label="Unavailable" />
<Checkbox :model-value="true" :disabled="true" label="Pre-selected" />
```

---

## CheckboxGroup

Layout wrapper for `Checkbox` components. Fixes vertical gap between items at 8px. Does not manage selection state.

### Example

```vue
<CheckboxGroup>
  <Checkbox v-model="notifications" label="Email notifications" />
  <Checkbox v-model="marketing" label="Marketing emails" />
</CheckboxGroup>
```

---

## RadioGroup + Radio

Radio buttons must always be used together. `RadioGroup` manages selected state and passes it down to `Radio` children via provide/inject. Only one option can be selected at a time.

Do not use `Radio` outside of `RadioGroup` — it will always appear unchecked.

### RadioGroup Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `modelValue` | `string \| number` | yes | Selected value (`v-model`) |
| `name` | `string` | yes | Shared `name` for all radio inputs |
| `disabled` | `boolean` | no | Disables all items in the group |
| `ariaLabel` | `string` | no | Accessible group label |
| `ariaLabelledby` | `string` | no | ID of element that labels the group |

### Radio Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string \| number` | yes | Value matched against `RadioGroup`'s `modelValue` |
| `label` | `string` | no | Label text |
| `disabled` | `boolean` | no | Disables this item only |
| `id` | `string` | no | Defaults to auto-generated |

### Example

```vue
<RadioGroup v-model="guardian" name="guardian">
  <Radio value="mother" label="Mother" />
  <Radio value="father" label="Father" />
  <Radio value="grandparent" label="Grandparent" />
</RadioGroup>
```

### Disabled

```vue
<!-- Disable entire group -->
<RadioGroup v-model="guardian" name="guardian" :disabled="true">
  <Radio value="mother" label="Mother" />
  <Radio value="father" label="Father" />
</RadioGroup>

<!-- Disable individual items -->
<RadioGroup v-model="guardian" name="guardian">
  <Radio value="mother" label="Mother" />
  <Radio value="nanny" label="Nanny" :disabled="true" />
</RadioGroup>
```
