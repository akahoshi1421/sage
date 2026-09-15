# props と emits で親子をつなぐ

子コンポーネント `Counter` を作り、親から初期値を受け取って、変更を親に伝えてください。

## 要件

1. `Counter` は `modelValue: number` を props で受け取る
2. ボタンをクリックすると `update:modelValue` を現在値 + 1 で emit する
3. 親は `<Counter v-model="count" />` で使える
