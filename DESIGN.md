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

### 3.2 主な定数
- GameConstants.QUESTION_COUNT: 出題数
- GameConstants.STANDARD_DELAY: 回答後の演出待機時間
- GameConstants.CORRECT_DELAY: 正解時の次問題遷移待機時間
- GameConstants.LOSE_DELAY: 不正解時の終了待機時間
- GameConstants.SECRET_CLICKS: CPA ゲート解放クリック数
- GameDefinitions.LIFELINES: 50:50、TEL、AUDIENCE の識別子

## 4. 詳細設計

### 4.1 共通関数

#### 4.1.1 goToPortal
- I/F:
  - 入力: なし
  - 出力: ポータル画面への location.assign
- 処理:
  1. PORTAL_PATH を使ってポータル画面へ遷移する。

#### 4.1.2 bindPortalActions
- I/F:
  - 入力: stage-back リンク、Escape キー
  - 出力: ポータル復帰イベント登録
- 処理:
  1. 戻るリンク押下時にデフォルト遷移を止めて goToPortal() を呼ぶ。
  2. Escape キー押下時に goToPortal() を呼ぶ。
- 分岐:
  - a. stage-back が存在しない場合: リンクイベントは登録しない。

#### 4.1.3 ensureNoticeModal
- 役割: ヒント表示用の notice-modal が未作成なら生成し、既存ならそれを返す。

#### 4.1.4 showNotice
- 役割: ヒント用モーダルのタイトルと本文を更新し表示する。

#### 4.1.5 showGateDialog
- I/F:
  - 入力: 表示メッセージ
  - 出力: Promise<boolean>
- 処理:
  1. gate-modal が無ければ動的生成する。
  2. OK とキャンセルのイベントを登録する。
  3. 操作結果を Promise で返す。
- 分岐:
  - a. 既存モーダルがある場合: 再生成せず文言だけ差し替える。
  - b. OK 押下時: true を返す。
  - c. キャンセル押下時: false を返す。

### 4.2 PortalManager クラス

#### 4.2.1 constructor
- I/F:
  - 入力: body、logo、secret-trigger
  - 出力: 初期化済み PortalManager
- 処理:
  1. クリック数とタイマーを初期化する。
  2. 必要 DOM を取得する。
  3. init() を呼んで秘密トリガーを有効化する。

#### 4.2.2 init
- 役割: secret-trigger の click を handleSecretClick() へ接続する。

#### 4.2.3 handleSecretClick
- I/F:
  - 入力: 現在クリック回数
  - 出力: 演出状態または CPA ゲート解放
- 処理:
  1. clicks を加算する。
  2. resetTimer() で一定時間後リセットを予約する。
  3. 規定回数なら unlockSecret()、途中段階なら applyRumble() を呼ぶ。
- 分岐:
  - a. clicks === SECRET_CLICKS: 解放処理へ進む。
  - b. clicks >= RUMBLE_THRESHOLD: ロゴ揺れ演出を適用する。

#### 4.2.4 applyRumble
- 役割: クリック数に応じて logo の拡大率と text-shadow を強める。

#### 4.2.5 unlockSecret
- I/F:
  - 入力: 解放済み演出状態
  - 出力: CPA ステージ遷移またはポータル再読込
- 処理:
  1. clearState() で中間演出を初期化する。
  2. ロゴ表記を CPA ACCESS に変更する。
  3. 一定時間後に showGateDialog() を表示する。
  4. 承認時は cpa.html へ遷移する。
  5. キャンセル時は window.location.reload() を行う。
- 分岐:
  - a. ダイアログ承認時: 隠しステージへ進む。
  - b. キャンセル時: ポータル状態を初期化する。

#### 4.2.6 resetTimer
- 役割: 連続クリック判定用タイマーを張り直し、無操作時に clearState() を呼ぶ。

#### 4.2.7 clearState
- 役割: click 数、body class、logo の transform と shadow を初期状態へ戻す。

### 4.3 QuizManager クラス

#### 4.3.1 constructor
- I/F:
  - 入力: allData
  - 出力: selected、current、DOM 参照を持つインスタンス
- 設定値:
  - REWARDS: STANDARD_REWARDS
- 処理:
  1. 全問題データを保持する。
  2. selected、current、isWait を初期化する。
  3. レベル表示、問題文、選択肢、報酬、モーダルの DOM を取得する。

#### 4.3.2 bindUIActions
- I/F:
  - 入力: ライフラインボタン、retry-btn、stage-back、Escape キー
  - 出力: UI イベント登録
- 処理:
  1. bindPortalActions() により戻るリンクと Escape 復帰を登録する。
  2. ライフラインボタンへ useLife() を登録する。
  3. retry-btn へ reload を登録する。
- 分岐:
  - a. ボタンが存在しない場合: そのイベントは登録しない。

#### 4.3.3 init
- I/F:
  - 入力: allData
  - 出力: selected 問題配列、初回描画
- 処理:
  1. Validator.isValidQuizData() で問題データを検証する。
  2. ランダム抽出で出題問題を QUESTION_COUNT 件に絞る。
  3. 報酬一覧を描画する。
  4. render() を実行する。
- 分岐:
  - a. 問題データが不正な場合: 画面へデータなしメッセージを表示する。

#### 4.3.4 render
- I/F:
  - 入力: current、selected
  - 出力: レベル表示、問題文、選択肢 DOM 更新
- 処理:
  1. isWait を false に戻す。
  2. 現在問題を取得する。
  3. レベル表示と問題文を更新する。
  4. reward-list のハイライトを更新する。
  5. choice ボタンを再生成し、各ボタンから check() を呼び出せるようにする。

#### 4.3.5 check
- I/F:
  - 入力: 選択ボタン、選択インデックス
  - 出力: 正誤演出、次問題遷移、終了モーダル
- 処理:
  1. 多重入力防止のため isWait を確認する。
  2. STANDARD_DELAY 後に正解インデックスと比較する。
  3. 正解なら current を進め、残問題があれば render()、なければ finish(true) を呼ぶ。
  4. 不正解なら wrong 表示と正解強調を行い、finish(false) を呼ぶ。
- 分岐:
  - a. isWait が true: 二重判定を行わず終了する。
  - b. index === correct: 正解ルートへ進む。
  - c. index !== correct: 失敗ルートへ進む。
  - d. current < QUESTION_COUNT: 次問題を描画する。
  - e. それ以外: クリアモーダルを表示する。

#### 4.3.6 useLife
- I/F:
  - 入力: ライフライン種別
  - 出力: 選択肢非表示またはヒントモーダル表示
- 処理:
  1. 使用済みか待機中かを確認する。
  2. ボタンを used 状態にする。
  3. 正解選択肢を取得する。
  4. FIFTY の場合は誤答 2 件を非表示にする。
  5. TEL / AUDIENCE の場合は showNotice() でヒントを出す。
- 分岐:
  - a. isWait または used 状態: 再使用しない。
  - b. type === FIFTY: 選択肢を減らす。
  - c. それ以外: テキストヒントを表示する。

#### 4.3.7 finish
- 役割: クリア時と失敗時で異なるタイトル・本文を result-modal へ表示する。

### 4.4 QuizEngineCPA クラス

#### 4.4.1 constructor
- 役割: QuizManager と同様の状態を持ちつつ、CPA_REWARDS を使う。

#### 4.4.2 bindUIActions
- 役割: ポータル復帰、ライフライン、リトライのイベントを登録する。
- 分岐:
  - a. ライフライン押下時に isWait または used なら何もしない。

#### 4.4.3 start
- 役割: 問題データを検証し、QUESTION_COUNT 件へ抽出して初回描画する。
- 分岐:
  - a. 問題データ不正時: データなし表示にする。

#### 4.4.4 render
- 役割: CPA EXAM 表記と専用報酬一覧で現在問題を描画する。

#### 4.4.5 check
- I/F:
  - 入力: 選択ボタン、選択インデックス
  - 出力: CPA 用の正誤演出、終了モーダル
- 処理:
  1. CPA_DELAY 後に正誤判定を行う。
  2. 正解時は current を進め、残問題があれば render()、なければ finish(true) を呼ぶ。
  3. 不正解時は wrong 表示後、CPA_LOSE_DELAY で finish(false) を呼ぶ。
- 分岐:
  - a. isWait が true: 多重入力を防止する。
  - b. 正解時: 次問題または合格表示へ進む。
  - c. 不正解時: 不合格表示へ進む。

#### 4.4.6 useLife
- 役割: FIFTY、ADVICE、AUDIENCE の CPA 専用文言を出し分ける。
- 分岐:
  - a. FIFTY: 誤答 2 件を非表示にする。
  - b. TEL: シニアパートナー文言を表示する。
  - c. AUDIENCE: 受験生反応文言を表示する。

#### 4.4.7 finish
- 役割: PASSED / FAILED の専用モーダルを表示する。

### 4.5 Validator / QuizConstants

#### 4.5.1 Validator.isValidQuizData
- 役割: 問題配列の存在、要素構造、answer の妥当性を検証する。

#### 4.5.2 QuizConstants.getQuizData
- 役割: 難易度識別子に応じて問題セットを返す。

## 5. 非機能要件
- 実行環境: Chrome / Edge 最新版、ローカルサーバー経由
- 品質ゲート: npm run lint、npm test、GitHub Actions CI
- 制約: 問題データは静的モジュール内に保持し、セッション間保存は行わない
