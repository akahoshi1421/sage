## 解答例

```vue
<script setup lang="ts">
const props = defineProps<{ modelValue: number }>();
const emit = defineEmits<{ "update:modelValue": [value: number] }>();
</script>

<template>
  <button @click="emit('update:modelValue', props.modelValue + 1)">{{ props.modelValue }}</button>
</template>
```
