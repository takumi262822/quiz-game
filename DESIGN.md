# 設計書: Quiz Game Portfolio

## 1. 文書概要

### 1.1 目的
本書は Quiz Game Portfolio の実装設計書である。画面構成や導線説明は SCREEN-OVERVIEW.md に分離し、本書では JavaScript 実装を対象に、ポータル画面、各ステージ、共通 UI、問題データの責務をクラス単位・メソッド単位・主要分岐単位で整理する。

### 1.2 対象範囲
- ポータル画面の秘密ゲート制御
- 通常ステージと CPA ステージの問題進行
- ライフライン、結果モーダル、ポータル復帰導線
- 問題データ定義、定数、入力検証

### 1.3 対象外
- サーバーサイド採点
- 問題データの外部 API 配信
- ユーザー認証
- スコア保存機能

## 2. システム構成

### 2.1 モジュール構成
| 区分 | ファイル | 役割 |
|---|---|---|
| ポータル起動 | quiz-app/src/main.js | ポータル画面の PortalManager を起動する |
| ステージ起動 | quiz-app/src/entry/beginner.js ほか | 難易度別の問題データを取得し QuizManager 系を起動する |
| 進行制御 | quiz-app/src/core/quiz-engine.js | 通常ステージと CPA ステージの問題進行を管理する |
| UI | quiz-app/src/ui/components.js | 選択肢ボタン、報酬一覧、結果モーダルを描画する |
| UI | quiz-app/src/ui/header.js | 共通ヘッダー表示を扱う |
| 定数 | quiz-app/src/constants/quiz-constants.js | 問題数、演出待機時間、報酬一覧を定義する |
| 定義 | quiz-app/src/constants/definitions.js | 難易度識別子、ライフライン識別子を定義する |
| データ | quiz-app/src/constants/quiz-data.js | 難易度別問題データを集約し取得 API を提供する |
| 検証 | quiz-app/src/utils/validator.js | 問題データ構造の妥当性を検証する |
| セキュリティ | quiz-app/src/utils/xss.js | テキストを安全に表示する補助を行う |

### 2.2 起動シーケンス
1. quiz-app/index.html が quiz-app/src/main.js を読み込む。
2. PortalManager が秘密トリガーと CPA ゲート制御を初期化する。
3. 各ステージ HTML は対応する entry ファイルを読み込む。
4. entry が QuizConstants.getQuizData() で問題データを取得し QuizManager または QuizEngineCPA を生成する。
5. bindUIActions() と init() または start() により問題進行を開始する。

## 3. データ設計

### 3.1 問題データ
| 項目 | 型 | 内容 |
|---|---|---|
| question | string | 問題文 |
| choices | string[] | 選択肢配列 |
| answer | number | 正解インデックス |

### 3.2 定数・識別子

定数の具体値は `docs/定数定義書.adoc`、識別子の種別値は `docs/コード定義書.adoc` を参照すること。

## 4. 設計方針

### 4.1 責務分離

問題進行ロジック（QuizManager / QuizEngineCPA）と UI 描画（UIComponents）を分離し、進行ロジックが DOM 構造に依存しない設計とした。PortalManager は画面遷移のみ担当し、問題データには関与しない。

### 4.2 データ主導

問題データは `constants/data/` に難易度別ファイルで分離し、`quiz-data.js` が集約 API を提供する。新難易度の追加はデータファイル 1 枚の追加と `quiz-data.js` への 1 行追記で完結する。

### 4.3 入力検証

QuizManager.init() は Validator.isValidQuizData() でデータ構造を検証してから抽出処理へ進む。不正データ時は画面にエラーを表示して処理を打ち切る。

### 4.4 XSS 対策

UIComponents での動的テキスト挿入には textContent を使用し、innerHTML による XSS を防止する。文字列を画面に表示する際はすべて xss.js を経由してサニタイズする。

## 5. 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| README.md | プロジェクト概要・実行手順 |
| SCREEN-OVERVIEW.md | 画面構成・遷移・UI 説明 |
| docs/機能設計書.adoc | クラス・メソッド・分岐単位の詳細仕様 |
| docs/コード定義書.adoc | 識別子・種別コードの定義 |
| docs/定数定義書.adoc | 定数値・設定値一覧 |
