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

    // Escape キーでもポータルに戻れる（キーボード操作の便宜性を落とさないため）
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
 * 問題進行・回答判定・ライフライン管理を扱うクラス（初級・通常・上級共通）。
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

    // --- 問題データを抽出し、クイズを開始する ---
    init() {
        if (!Validator.isValidQuizData(this.allData)) {
            this.elBox.textContent = 'データがありません';
            return;
        }
        // Fisher-Yates に近い簡易シャッフルで QUESTION_COUNT 問を抽出
        this.selected = [...this.allData]
            .sort(() => 0.5 - Math.random())
            .slice(0, GameConstants.QUESTION_COUNT);
        UIComponents.renderRewardList(this.elRewardList, this.REWARDS);
        this.render();
    }

    // --- 現在の問題を画面に描画する ---
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

    // --- 回答ボタンのクリックを処理し、正誤判定を行う ---
    check(btn, index) {
        if (this.isWait) return;
        this.isWait = true;
        btn.classList.add('selected');

        setTimeout(() => {
            const correct = this.selected[this.current].answer;
            if (index === correct) {
                btn.classList.add('correct');
                setTimeout(() => {
                if (btns[correct]) btns[correct].classList.add('correct');
                setTimeout(() => this.finish(false), GameConstants.LOSE_DELAY);
            }
        }, GameConstants.STANDARD_DELAY);
    }

    // --- ライフラインを使用する（50:50 / 電話 / 観客） ---
    useLife(type) {
        const btn = document.getElementById(type);
        if (this.isWait || btn.classList.contains('used')) return;
        btn.classList.add('used');

        const correctIndex = this.selected[this.current].answer;
        const correctTxt   = this.selected[this.current].choices[correctIndex];

        if (type === GameDefinitions.LIFELINES.FIFTY) {
            // 正解以外の選択肢をランダムに 2 つ選んで非表示にする
            const btns = Array.from(document.querySelectorAll('.choice-btn'));
            btns.filter(b => b.textContent !== correctTxt)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .forEach(b => b.style.visibility = 'hidden');
        } else {
            // 電話・観客はモーダルでヒントを表示（正解を稀にぼかす文言）
            const msg = type === GameDefinitions.LIFELINES.TEL
                ? `友人:「確か、答えは『${correctTxt}』だったはずだ。確率は高いよ。」`
                : `観客の反応: 約65%が「${correctTxt}」に注目しているようです。`;
            showNotice(msg);
        }
    }

    // --- クイズ終了：勝利 or 敗北モーダルを表示する ---
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
 * CPA ステージ専用の問題進行クラス。CPA_REWARDS と CPA_DELAY を使用する。
 */
    // --- DOMノード参照・状態変数の初期化（CPA用） ---
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

    // --- UIイベントのバインド（ライフライン・リトライ）（CPA用） ---
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

    // --- 問題データをシャッフルし、CPAクイズを開始 ---
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

    // --- 現在の問題をCPA順次表运で描画 ---
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

    // --- 回答の正誤判定（CPA遅延設定適用） ---
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

    // --- ライフラインを使用する（CPA教利系メッセージ） ---
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

    // --- クイズ終了：合格 / 不合格モーダルを表示（CPA用） ---
    finish(win) {
        UIComponents.showModal(
            this.elModal,
            win ? 'PASSED' : 'FAILED',
            win ? '全問クリア。監査の世界へ、ようこそ。'
                : '不合格。監査基準を再確認し、次の試験期に臨め。'
        );
    }
}