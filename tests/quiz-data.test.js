import test from 'node:test';
import assert from 'node:assert/strict';

import { QuizConstants } from '../quiz-app/src/constants/quiz-data.js';

test('convertDataFormat converts old q/c/a format to question/choices/answer index', () => {
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

test('findAnswerIndex falls back to 0 when answer text is not found', () => {
    const converted = QuizConstants.convertDataFormat([
        { q: 'Q3', c: ['Left', 'Right'], a: 'Unknown' }
    ]);

    assert.equal(converted[0].answer, 0);
});
