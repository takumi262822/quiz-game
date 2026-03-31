/**
 * GameDefinitions クラス - コード定義クラス
 * ゲーム全体で使用する列挙型・コード値を一元定義
 * @author Takumi Harada
 * @date 2026-03-31
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
