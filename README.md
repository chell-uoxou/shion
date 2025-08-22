# shion
watnowハッカソン 2025 チーム7 「おどるゆめ」

## フォルダ構成
- **/backend**: バックエンドのコードベース
- **/frontend**: フロントエンドのコードベース
- **/db**: DBのスキーマとマイグレーション

## 必要ソフト
- Docker
- Docker Compose
- Make

## 開発方法
### 開発コンテナの起動
バックエンドの開発サーバー、DB、DBのマイグレーションツールのコンテナを起動します。
```bash
docker-compose up -d
```

### データベースのマイグレーション系操作

```
make migrate-create name=migration_name
```
  新しいマイグレーションファイルを作成します。
  `migration_name` の部分に名前を指定すると、`db/migrations` に
  `00000X_migration_name.up.sql` / `00000X_migration_name.down.sql` が生成されます。

```
make migrate-up
```
  未適用のマイグレーションをすべて実行し、DBを最新の状態に更新します。

```
make migrate-down
```
  直前のマイグレーションを1つ取り消します（開発中の試行錯誤に便利）。

```
make migrate-reset
```
  データベースを全削除したあと、すべてのマイグレーションを再実行します。
  開発中にスキーマをきれいに作り直したいときに使います。