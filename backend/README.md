# shion　バックエンド
shionのバックエンドサーバー
go製

## 開発にあたって
- ハンドラを先に作って、その現状を満たすAPIの仕様をopenapi.yamlに記述すること
- frontendのAPIクライアントのために、最新のopenapi.yamlが用いられるから

## フォルダ構成
```
.
├── Dockerfile
├── go.mod
├── go.sum
├── handler
│   └── endpoint_name.go    ← APIエンドポイントごとにハンドラを分割
│  
├── repository              ← DBにアクセスする層
│    └── postgres
│      ├── connect.go       ← DB接続関係
│      └── table_name.go    ← DBテーブルにアクセスするためのリポジトリ
│                             （複数メソッドは同一ファイルに）
├── main.go                 ← エントリポイント
├── openapi.yaml            ← OpenAPI仕様（handlerの現状に都度合わせて手動で更新すること）
└── README.md

```