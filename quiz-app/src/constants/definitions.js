/**
 * GameDefinitions クラス - コード定義クラス
 * ゲーム全体で使用する列挙型・コード値を一元定義
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * GameDefinitions クラス
 * 目的: アプリ全体で再利用する定数・コード定義を管理する
 * 入力: なし（静的参照）
 * 処理: 定数を用途別に定義し参照しやすく整理する
 * 出力: 画面制御や判定で使用する不変値
 * 補足: 変更時は参照側ロジックの影響を確認する
 * @author Takumi Harada
 * @date 2026-04-01
 */
/**
 * 定数概要:
 * - LEVELS は難易度識別子を統一するコード定義
 * - LIFELINES はライフラインボタンと処理分岐で使う識別子
 * - RESULT と LEVEL_LABELS は結果表示や画面文言をそろえる表示定数
 */
export class GameDefinitions {
    /** 難易度レベル定義 */
    static LEVELS = Object.freeze({
        BEGINNER: 'beginner',
        NORMAL:   'normal',
        ELITE:    'elite',
        CPA:      'cpa'
    });

    /** ライフライン種別定義 */
    static LIFELINES = Object.freeze({
        FIFTY:    'fifty',
        TEL:      'tel',
        AUDIENCE: 'aud'
    });

    /** ゲーム結果定義 */
    static RESULT = Object.freeze({
        WIN:  'win',
        LOSE: 'lose'
    });

    /** レベル表示ラベル */
    static LEVEL_LABELS = Object.freeze({
        beginner: 'ビギナー',
        normal:   'ノーマル',
        elite:    'エリート',
        cpa:      'CPA'
    });
}
