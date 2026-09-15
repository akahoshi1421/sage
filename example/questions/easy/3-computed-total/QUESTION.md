# computed で合計を求める

商品の一覧から合計金額を算出プロパティで求めてください。

## 要件

1. `items` は `{ name: string; price: number }[]` のリアクティブな配列
2. `total` は `items` の `price` の合計を返す算出プロパティ
3. テンプレートに `合計: {{ total }} 円` と表示する
