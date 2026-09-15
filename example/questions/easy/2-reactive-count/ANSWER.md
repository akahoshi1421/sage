## 解答例

```vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const increment = () => {
  count.value++;
};
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

## 解説

`ref` はプリミティブな値をリアクティブにするための関数です。
`<script setup>` の中では `.value` を通して読み書きしますが、テンプレート内では自動的にアンラップされます。
