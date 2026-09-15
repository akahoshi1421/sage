## 解答例

```vue
<script setup lang="ts">
import { computed, ref } from "vue";

const items = ref([
  { name: "りんご", price: 120 },
  { name: "みかん", price: 80 },
]);
const total = computed(() => items.value.reduce((sum, item) => sum + item.price, 0));
</script>

<template>
  <p>合計: {{ total }} 円</p>
</template>
```

## 解説

`computed` は依存している値が変わったときだけ再計算されるキャッシュ付きの値です。
