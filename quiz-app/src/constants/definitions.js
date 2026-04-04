/**
 * 難易度・ライフライン種別・ゲーム結果・表示ラベルのコード値を一元定義するクラス。
 * @author Takumi Harada
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
