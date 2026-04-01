/**
 * Validator クラス - バリデーションクラス
 * 入力値・データの検証を一元管理
 * @author Takumi Harada
 * @date 2026-03-31
 */
import { GameDefinitions } from '../constants/definitions.js';

/**
 * Validator クラス
 * 目的: 入力検証を担当し判定ルールを統一する
 * 入力: フォーム入力値・データオブジェクト
 * 処理: 形式/範囲/必須条件を検証して真偽値を返す
 * 出力: 検証結果（boolean）
 * 補足: 画面側でエラー表示制御と組み合わせて利用する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class Validator {
    /**
     * 難易度レベル値が有効か確認する
     * @param {string} level
     * @returns {boolean}
     */
    static isValidLevel(level) {
        return Object.values(GameDefinitions.LEVELS).includes(level);
    }

    /**
     * クイズデータ配列が有効か確認する
     * @param {Array} data
     * @returns {boolean}
     */
    static isValidQuizData(data) {
        return Array.isArray(data) && data.length > 0;
    }

    /**
     * 1問分のクイズオブジェクトが有効か確認する（内部形式）
     * @param {{ question: string, choices: string[], answer: number }} q
     * @returns {boolean}
     */
    static isValidQuestion(q) {
        return q != null
            && typeof q.question === 'string'
            && Array.isArray(q.choices)
            && q.choices.length >= 2
            && typeof q.answer === 'number'
            && q.answer >= 0
            && q.answer < q.choices.length;
    }
}
