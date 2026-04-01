/**
 * QuizManager クラス - ゲームエンジン（初級・中級・上級）
 * @author Takumi Harada
 * @date 2026-03-31
 */
import { GameConstants } from '../constants/quiz-constants.js';
import { GameDefinitions } from '../constants/definitions.js';
import { Validator } from '../utils/validator.js';
import { UIComponents } from '../ui/components.js';

const PORTAL_PATH = '../../quiz-app/index.html';

function goToPortal() {
    window.location.assign(PORTAL_PATH);
}

function bindPortalActions() {
    const backLink = document.getElementById('stage-back');
    backLink?.addEventListener('click', (event) => {
        event.preventDefault();
        goToPortal();
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            goToPortal();
        }
    });
}

function ensureNoticeModal() {
    let modal = document.getElementById('notice-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'notice-modal';
    modal.className = 'overlay';
    modal.innerHTML = [
        '<h1 id="notice-title">HINT</h1>',
        '<p id="notice-msg" style="margin:16px 0; max-width: 640px; text-align:center;"></p>',
        '<button id="notice-close" class="retry-btn" type="button">閉じる</button>'
    ].join('');
    document.body.appendChild(modal);

    const closeBtn = document.getElementById('notice-close');
    closeBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    return modal;
}

function showNotice(message, title = 'HINT') {
    const modal = ensureNoticeModal();
    const titleEl = document.getElementById('notice-title');
    const msgEl = document.getElementById('notice-msg');
    if (!titleEl || !msgEl) {
        return;
    }
    titleEl.textContent = title;
    msgEl.textContent = message;
    modal.style.display = 'flex';
}

/**
 * QuizManager クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class QuizManager {
    constructor(data) {
        this.allData = data;
        this.selected = [];
        this.current  = 0;
        this.isWait   = false;

        this.REWARDS = [...GameConstants.STANDARD_REWARDS];

        this.elLevel      = document.getElementById('level-indicator');
        this.elBox        = document.getElementById('question-box');
        this.elChoices    = document.getElementById('choices-container');
        this.elRewardList = document.getElementById('reward-list');
        this.elModal      = document.getElementById('result-modal');
        this.elRetryBtn   = document.getElementById('retry-btn');
    }

    bindUIActions() {
        bindPortalActions();

        [GameDefinitions.LIFELINES.FIFTY,
         GameDefinitions.LIFELINES.TEL,
         GameDefinitions.LIFELINES.AUDIENCE].forEach((id) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('click', () => this.useLife(id));
        });

        if (this.elRetryBtn) {
            this.elRetryBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    init() {
        if (!Validator.isValidQuizData(this.allData)) {
            this.elBox.textContent = 'データがありません';
            return;
        }
        this.selected = [...this.allData]
            .sort(() => 0.5 - Math.random())
            .slice(0, GameConstants.QUESTION_COUNT);
        UIComponents.renderRewardList(this.elRewardList, this.REWARDS);
        this.render();
    }

    render() {
        this.isWait = false;
        const q = this.selected[this.current];

        this.elLevel.textContent = `LEVEL ${String(this.current + 1).padStart(2, '0')}`;
        this.elBox.textContent   = q.question;

        UIComponents.highlightReward(this.current);

        this.elChoices.innerHTML = '';
        q.choices.forEach((txt, i) => {
            this.elChoices.appendChild(
                UIComponents.createChoiceButton(txt, () => this.check(
                    this.elChoices.querySelectorAll('.choice-btn')[i], i
                ))
            );
        });
    }

    check(btn, index) {
        if (this.isWait) return;
        this.isWait = true;
        btn.classList.add('selected');

        setTimeout(() => {
            const correct = this.selected[this.current].answer;
            if (index === correct) {
                btn.classList.add('correct');
                setTimeout(() => {
                    this.current++;
                    if (this.current < GameConstants.QUESTION_COUNT) this.render();
                    else this.finish(true);
                }, GameConstants.CORRECT_DELAY);
            } else {
                btn.classList.add('wrong');
                const btns = Array.from(this.elChoices.querySelectorAll('.choice-btn'));
                if (btns[correct]) btns[correct].classList.add('correct');
                setTimeout(() => this.finish(false), GameConstants.LOSE_DELAY);
            }
        }, GameConstants.STANDARD_DELAY);
    }

    useLife(type) {
        const btn = document.getElementById(type);
        if (this.isWait || btn.classList.contains('used')) return;
        btn.classList.add('used');

        const correctIndex = this.selected[this.current].answer;
        const correctTxt   = this.selected[this.current].choices[correctIndex];

        if (type === GameDefinitions.LIFELINES.FIFTY) {
            const btns = Array.from(document.querySelectorAll('.choice-btn'));
            btns.filter(b => b.textContent !== correctTxt)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .forEach(b => b.style.visibility = 'hidden');
        } else {
            const msg = type === GameDefinitions.LIFELINES.TEL
                ? `友人:「確か、答えは『${correctTxt}』だったはずだ。確率は高いよ。」`
                : `観客の反応: 約65%が「${correctTxt}」に注目しているようです。`;
            showNotice(msg);
        }
    }

    finish(win) {
        UIComponents.showModal(
            this.elModal,
            win ? 'BRILLIANT!' : 'GAME OVER',
            win ? '素晴らしい知性です。1000万ドリームを手にしました。'
                : '惜しい挑戦でした。知恵を蓄え、再訪を。'
        );
    }
}

/**
 * QuizEngineCPA クラス - ゲームエンジン（CPA専用 Ruby Horror Edition）
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * QuizEngineCPA クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class QuizEngineCPA {
    constructor(data) {
        this.allData = data;
        this.selected = [];
        this.current  = 0;
        this.isWait   = false;

        this.REWARDS = [...GameConstants.CPA_REWARDS];

        this.elBox        = document.getElementById('question-box');
        this.elChoices    = document.getElementById('choices-container');
        this.elRewardList = document.getElementById('reward-list');
        this.elLevel      = document.getElementById('level-indicator');
        this.elModal      = document.getElementById('result-modal');
        this.elRetryBtn   = document.getElementById('retry-btn');
    }

    bindUIActions() {
        bindPortalActions();

        [GameDefinitions.LIFELINES.FIFTY,
         GameDefinitions.LIFELINES.TEL,
         GameDefinitions.LIFELINES.AUDIENCE].forEach((id) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('click', () => {
                if (this.isWait || btn.classList.contains('used')) return;
                btn.classList.add('used');
                this.useLife(id);
            });
        });

        if (this.elRetryBtn) {
            this.elRetryBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    start() {
        if (!Validator.isValidQuizData(this.allData)) {
            this.elBox.textContent = 'データがありません';
            return;
        }
        this.selected = [...this.allData]
            .sort(() => 0.5 - Math.random())
            .slice(0, GameConstants.QUESTION_COUNT);
        UIComponents.renderRewardList(this.elRewardList, this.REWARDS);
        this.render();
    }

    render() {
        this.isWait = false;
        const q = this.selected[this.current];

        this.elLevel.textContent = `CPA EXAM #${String(this.current + 1).padStart(2, '0')}`;
        this.elBox.textContent   = q.question;

        UIComponents.highlightReward(this.current);

        this.elChoices.innerHTML = '';
        q.choices.forEach((txt, i) => {
            this.elChoices.appendChild(
                UIComponents.createChoiceButton(txt, () => this.check(
                    this.elChoices.querySelectorAll('.choice-btn')[i], i
                ))
            );
        });
    }

    check(btn, index) {
        if (this.isWait) return;
        this.isWait = true;
        btn.classList.add('selected');

        setTimeout(() => {
            const correct = this.selected[this.current].answer;
            if (index === correct) {
                btn.classList.add('correct');
                setTimeout(() => {
                    this.current++;
                    if (this.current < GameConstants.QUESTION_COUNT) this.render();
                    else this.finish(true);
                }, GameConstants.CORRECT_DELAY);
            } else {
                btn.classList.add('wrong');
                setTimeout(() => this.finish(false), GameConstants.CPA_LOSE_DELAY);
            }
        }, GameConstants.CPA_DELAY);
    }

    useLife(type) {
        const correctIndex = this.selected[this.current].answer;
        const correctTxt   = this.selected[this.current].choices[correctIndex];

        if (type === GameDefinitions.LIFELINES.FIFTY) {
            const btns = Array.from(document.querySelectorAll('.choice-btn'));
            btns.filter(b => b.textContent !== correctTxt)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .forEach(b => b.style.visibility = 'hidden');
        } else if (type === GameDefinitions.LIFELINES.TEL) {
            showNotice(`シニアパートナー:「答えは『${correctTxt}』だと考えるが、監査判断は君に委ねる。」`, 'ADVICE');
        } else {
            showNotice(`受験生の反応: 約68%が「${correctTxt}」を選択しているようです。`, 'AUDIENCE');
        }
    }

    finish(win) {
        UIComponents.showModal(
            this.elModal,
            win ? 'PASSED' : 'FAILED',
            win ? '全問クリア。監査の世界へ、ようこそ。'
                : '不合格。監査基準を再確認し、次の試験期に臨め。'
        );
    }
}