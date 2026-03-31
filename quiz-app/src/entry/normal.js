/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import { GameDefinitions } from '../constants/definitions.js';
import { QuizConstants } from '../constants/quiz-data.js';
import { QuizManager } from '../core/quiz-engine.js';

document.addEventListener('DOMContentLoaded', () => {
    const data = QuizConstants.getQuizData(GameDefinitions.LEVELS.NORMAL);
    const engine = new QuizManager(data);
    engine.bindUIActions();
    engine.init();
});
