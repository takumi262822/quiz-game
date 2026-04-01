/**
 * QuizConstants クラス - データ集約クラス
 * 各レベルのデータファイルを集約し、ゲームエンジン用フォーマットに変換する
 * ※ 実データは constants/data/ 配下の各ファイルに分離
 * @author Takumi Harada
 * @date 2026-03-31
 */
import { GameDefinitions } from './definitions.js';
import { BEGINNER_DATA } from './data/beginner-data.js';
import { NORMAL_DATA } from './data/normal-data.js';
import { ELITE_DATA } from './data/elite-data.js';
import { CPA_DATA } from './data/cpa-data.js';

/**
 * 定数概要:
 * - QuizConstants は難易度別問題プールを取得し、ゲーム用の共通形式へ変換する
 * - data 配下の定数配列は問題文、選択肢、正解値のマスターデータとして参照される
 */

/**
 * QuizConstants クラス
 * 目的: アプリ全体で再利用する定数・コード定義を管理する
 * 入力: なし（静的参照）
 * 処理: 定数を用途別に定義し参照しやすく整理する
 * 出力: 画面制御や判定で使用する不変値
 * 補足: 変更時は参照側ロジックの影響を確認する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class QuizConstants {
    /**
     * レベルに応じたクイズデータを取得（ゲームエンジン用フォーマットに変換して返す）
     * @param {string} level - GameDefinitions.LEVELS のいずれか
     * @returns {{ question: string, choices: string[], answer: number }[]}
     */
    static getQuizData(level) {
        const dataMap = {
            [GameDefinitions.LEVELS.BEGINNER]: BEGINNER_DATA,
            [GameDefinitions.LEVELS.NORMAL]: NORMAL_DATA,
            [GameDefinitions.LEVELS.ELITE]: ELITE_DATA,
            [GameDefinitions.LEVELS.CPA]: CPA_DATA,
        };
        const raw = dataMap[level] || [];
        return this.convertDataFormat(raw);
    }

    /**
     * 旧形式 {q, c, a} を内部形式 {question, choices, answer(index)} に変換
     * @param {Array} oldData
     * @returns {Array}
     */
    static convertDataFormat(oldData) {
        return oldData.map(item => ({
            question: item.question || item.q,
            choices:  item.choices  || item.c,
            answer:   this._findAnswerIndex(
                item.choices || item.c,
                item.answer  || item.a
            )
        }));
    }

    /**
     * 正解文字列から選択肢配列内のインデックスを返す
     * @param {string[]} choices
     * @param {string|number} answer
     * @returns {number}
     */
    static _findAnswerIndex(choices, answer) {
        if (typeof answer === 'number') return answer;
        const idx = choices.indexOf(answer);
        return idx >= 0 ? idx : 0;
    }
}