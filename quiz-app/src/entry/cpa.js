/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import { GameDefinitions } from '../constants/definitions.js';
import { QuizConstants } from '../constants/quiz-data.js';
import { QuizEngineCPA } from '../core/quiz-engine.js';

document.addEventListener('DOMContentLoaded', () => {
    const data = QuizConstants.getQuizData(GameDefinitions.LEVELS.CPA);
    const engine = new QuizEngineCPA(data);
    engine.bindUIActions();
    engine.start();
});
