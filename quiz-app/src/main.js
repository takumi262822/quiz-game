/**
 * PortalManager クラス - Mainクラス
 * ポータル画面のインタラクション・CPA秘密ゲートを管理
 * @author Takumi Harada
 * @date 2026-03-31
 */
import { GameConstants } from './constants/quiz-constants.js';

function showGateDialog(message) {
    return new Promise((resolve) => {
        let modal = document.getElementById('gate-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'gate-modal';
            modal.style.position = 'fixed';
            modal.style.inset = '0';
            modal.style.background = 'rgba(0, 0, 0, 0.92)';
            modal.style.display = 'none';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';

            const panel = document.createElement('div');
            panel.style.width = 'min(92vw, 640px)';
            panel.style.padding = '24px';
            panel.style.border = '1px solid #d4af37';
            panel.style.background = 'rgba(0, 8, 20, 0.96)';
            panel.style.color = '#fff';
            panel.style.textAlign = 'left';

            const title = document.createElement('h2');
            title.textContent = 'CPA GATE';
            title.style.marginTop = '0';
            title.style.color = '#d4af37';

            const msg = document.createElement('p');
            msg.id = 'gate-modal-message';
            msg.style.whiteSpace = 'pre-line';
            msg.style.lineHeight = '1.7';

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '12px';
            actions.style.justifyContent = 'flex-end';
            actions.style.marginTop = '18px';

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'キャンセル';
            cancelBtn.style.padding = '10px 18px';
            cancelBtn.style.cursor = 'pointer';

            const okBtn = document.createElement('button');
            okBtn.type = 'button';
            okBtn.textContent = 'アクセス継続';
            okBtn.style.padding = '10px 18px';
            okBtn.style.border = '1px solid #d4af37';
            okBtn.style.background = '#d4af37';
            okBtn.style.color = '#000';
            okBtn.style.cursor = 'pointer';

            actions.append(cancelBtn, okBtn);
            panel.append(title, msg, actions);
            modal.appendChild(panel);
            document.body.appendChild(modal);
        }

        const msgEl = document.getElementById('gate-modal-message');
        const [cancelBtn, okBtn] = modal.querySelectorAll('button');
        msgEl.textContent = message;

        const cleanup = () => {
            modal.style.display = 'none';
            cancelBtn.removeEventListener('click', onCancel);
            okBtn.removeEventListener('click', onOk);
        };

        const onCancel = () => {
            cleanup();
            resolve(false);
        };

        const onOk = () => {
            cleanup();
            resolve(true);
        };

        cancelBtn.addEventListener('click', onCancel);
        okBtn.addEventListener('click', onOk);
        modal.style.display = 'flex';
    });
}

/**
 * PortalManager クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
 */
class PortalManager {
    constructor() {
        this.clicks    = 0;
        this.timer     = null;
        this.elBody    = document.body;
        this.elLogo    = document.getElementById('logo');
        this.elTrigger = document.getElementById('secret-trigger');
        this.init();
    }

    init() {
        this.elTrigger.addEventListener('click', () => this.handleSecretClick());
    }

    handleSecretClick() {
        this.clicks++;
        this.resetTimer();

        if (this.clicks === GameConstants.SECRET_CLICKS) {
            this.unlockSecret();
        } else if (this.clicks >= GameConstants.RUMBLE_THRESHOLD) {
            this.applyRumble();
        }
    }

    applyRumble() {
        const intensity = this.clicks - (GameConstants.RUMBLE_THRESHOLD - 1);
        this.elBody.classList.add('is-rumbling');
        this.elLogo.style.transform  = `scale(${1 + intensity * 0.15})`;
        this.elLogo.style.textShadow =
            `0 0 ${intensity * 20}px gold, 0 0 ${intensity * 40}px white`;
    }

    unlockSecret() {
        this.clearState();
        this.elBody.classList.add('is-unlocked');
        this.elLogo.innerText = 'CPA ACCESS';

        setTimeout(async () => {
            const accepted = await showGateDialog(
                '【公認会計士専用ゲート】\n\n' +
                'ここから先は、監査の真実を知る者のみが立ち入れる領域です。\n' +
                '職業倫理に基づき、アクセスを継続しますか？'
            );
            if (accepted) {
                window.location.href = '../screens/main/cpa.html';
                return;
            }
            window.location.reload();
        }, GameConstants.UNLOCK_DELAY);
    }

    resetTimer() {
        clearTimeout(this.timer);
        this.timer = setTimeout(
            () => this.clearState(),
            GameConstants.RESET_TIMEOUT
        );
    }

    clearState() {
        this.clicks = 0;
        this.elBody.classList.remove('is-rumbling', 'is-unlocked');
        this.elLogo.style.transform  = '';
        this.elLogo.style.textShadow = '';
    }
}

new PortalManager();