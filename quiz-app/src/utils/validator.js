/**
 * 難易度値・クイズデータ・各設問の形式チェックを行うバリデーションクラス。
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { GameDefinitions } from '../constants/definitions.js';

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
