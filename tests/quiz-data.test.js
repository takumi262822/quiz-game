import test from 'node:test';
import assert from 'node:assert/strict';

import { QuizConstants } from '../quiz-app/src/constants/quiz-data.js';

// 旧形式の問題データを現在の問題形式へ正しく変換できるかを確認する。
test('旧形式の問題データを現在の出題形式へ変換できること', () => {
    const oldData = [
        { q: 'Q1', c: ['A', 'B', 'C'], a: 'B' },
        { question: 'Q2', choices: ['X', 'Y'], answer: 1 }
    ];

    const converted = QuizConstants.convertDataFormat(oldData);

    assert.equal(converted.length, 2);
    assert.deepEqual(converted[0], {
        question: 'Q1',
        choices: ['A', 'B', 'C'],
        answer: 1
    });
    assert.deepEqual(converted[1], {
        question: 'Q2',
        choices: ['X', 'Y'],
        answer: 1
    });
});

// 正解文字列が選択肢に存在しない場合に先頭選択肢へ安全にフォールバックするかを確認する。
test('正解文字列が見つからない場合は先頭選択肢へ安全にフォールバックすること', () => {
    const converted = QuizConstants.convertDataFormat([
        { q: 'Q3', c: ['Left', 'Right'], a: 'Unknown' }
    ]);

    assert.equal(converted[0].answer, 0);
});
