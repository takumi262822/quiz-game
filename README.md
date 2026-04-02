# Quiz Game Portfolio

企業提出向けに整備したクイズゲームです。ES Modules ベースで画面ごとの責務を分離しています。

## 1. 採用担当向けサマリー

- 目的: フロントエンド実装力と設計改善力を短時間で確認できる提出物
- 想定閲覧時間: 5-10分
- 見てほしい点: モジュール分割、依存管理、UIイベント設計、画面遷移の一貫性

## 2. 作成者情報

- 作成者: Takumi Harada
- 作成日: 2026-03-31
- ドキュメント最終更新日: 2026-03-31

## 3. ディレクトリ構成

```text
quiz-game/
  quiz-app/
    index.html
    src/
      constants/
      core/
      entry/
      styles/
      ui/
      utils/
  screens/
    main/
      beginner.html
      normal.html
      elite.html
      cpa.html
```

## 4. 実行方法

このプロジェクトは `type="module"` を使用しているため、`file://` 直開きではなくローカルサーバー経由で実行してください。

```powershell
cd C:\テスト\quiz-game
python -m http.server 5500
```

ブラウザで `http://localhost:5500/quiz-app/index.html` を開きます。

## 5. 品質チェック（Lint / Test）

```powershell
cd C:\テスト\quiz-game
npm install
npm run lint
npm run test
```

まとめて実行する場合:

```powershell
npm run check
```

CI: `.github/workflows/ci.yml`

### テスト方針

- `tests/quiz-data.test.js` で問題データ変換の互換性を固定し、旧形式データを壊さないことを確認しています。
- テスト名は日本語で統一し、採用担当が見ても「どの仕様を守っているか」を一読で把握できる形にしています。
- 画面遷移や UI 操作は手動確認、データ整形や正解判定の土台は自動テスト、という分担を明確にしています。

## 6. 関連文書

- SCREEN-OVERVIEW.md: 画面構成、遷移、各画面の見せ方
- DESIGN.md: ポータルと各ステージの実装設計、主要クラス、分岐の説明

## 7. 5分評価ガイド

1. `quiz-app/index.html` を起動
2. 初級/中級/上級で10問進行を確認
3. ライフライン1回制限と結果モーダル表示を確認
4. 隠しゲートから CPA 画面遷移を確認
5. `quiz-app/src/entry/*.js` と `quiz-app/src/core/quiz-engine.js` を確認

## 8. 実装の工夫

- 依存関係を `import/export` に統一
- `entry` 層で起動責務を分離
- `onclick` を廃止しイベント登録を統一
- 標準ダイアログを避け、画面内モーダルへ集約

## 9. 対応環境・既知の制約

- 推奨ブラウザ: Chrome / Edge の最新安定版
- スマホ表示: 各ステージでメインへ戻る導線を固定表示
- 既知の制約: ビルドツール無し構成（学習・確認容易性を優先）

## 10. 今後の改善

- 問題データの外部化と E2E テスト追加

## 11. 提出チェックリスト

- [ ] 起動手順が再現できる
- [ ] `npm run lint` / `npm test` が通る
- [ ] 主要導線（難易度遷移・CPA遷移・復帰導線）が動作する
- [ ] README の評価ガイドに沿って説明できる
