# 設計書: Quiz Game Portfolio

## 1. 目的
- 開発目的: クイズゲームを題材に、画面遷移と問題進行ロジックの分離設計を示す。
- 評価してほしい点: エントリーポイント分離、共通UI部品化、入力イベント設計。

## 2. 画面構成・遷移
- 画面一覧:
  - ポータル画面 (`quiz-app/index.html`)
  - ステージ画面 (`screens/main/beginner.html`, `normal.html`, `elite.html`, `cpa.html`)
- 遷移:
  - ポータル -> 各ステージ
  - ステージ内で問題進行 -> 結果モーダル
  - ステージ内の戻る導線 -> ポータル

## 3. クラス設計
| クラス | 責務 | 主なメソッド | 依存 |
|---|---|---|---|
| QuizManager | 通常難易度の進行管理 | init, render, check, useLife, finish | UIComponents, Validator |
| QuizEngineCPA | CPA難易度の進行管理 | start, render, check, useLife, finish | UIComponents, Validator |
| UIComponents | 共通UI生成/表示 | createChoiceButton, renderRewardList, showModal | DOM |
| Validator | 入力・データ妥当性検証 | isValidQuizData など | 定数・問題データ |
| XSSProtection | テキスト/HTMLの安全表示 | escapeHTML, safeSetText | DOM |

## 4. データ設計
- 定数: `quiz-app/src/constants/quiz-constants.js`, `definitions.js`
- 問題データ: `quiz-app/src/constants/data/*.js`
- データ集約: `quiz-app/src/constants/quiz-data.js`
- 永続化: 基本なし（プレイセッション内管理）

## 5. 非機能
- 命名規則: `quiz-app` 配下で命名を統一。
- 品質ゲート: `npm run lint`, `npm test`, GitHub Actions CI。
- 対応環境: Chrome / Edge 最新版推奨。
- 既知制約: ビルドツールなし（素のES Modules構成）。

## 6. 今後改善
- 問題データ差し替え機構（JSONロード）追加。
- ステージ別E2Eテストの追加。

## 7. 提出チェックリスト
- [ ] 起動手順を第三者が再現できる
- [ ] lint/test が通る
- [ ] ステージ遷移とライフライン制御を説明できる
- [ ] 既知制約を説明できる
