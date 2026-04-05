/**
 * 選択肢ボタン・賞金一覧などクイズ画面共通の DOM 部品を生成・更新するクラス。
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class UIComponents {
    /**
     * 選択肢ボタンを生成して返す
     * @param {string}   text    - ボタンに表示するテキスト
     * @param {Function} onClick - クリック時のコールバック
     * @returns {HTMLButtonElement}
     */
    static createChoiceButton(text, onClick) {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = text;
        btn.onclick = onClick;
        return btn;
    }

    /**
     * 賞金リストを描画する
     * @param {HTMLElement} container - 描画先の <ul> 要素
     * @param {string[]}    rewards   - 賞金文字列の配列（昇順）
     */
    static renderRewardList(container, rewards) {
        container.innerHTML = rewards.slice().reverse().map((m, i) => {
            const idx = rewards.length - 1 - i;
            return `<li id="m-${idx}">▶ ￥${m}</li>`;
        }).join('');
    }

    /**
     * 現在問題インデックスに対応する賞金リストをハイライトする
     * @param {number} index - 現在の問題インデックス（0 始まり）
     */
    static highlightReward(index) {
        document.querySelectorAll('.reward-sidebar li')
            .forEach(li => li.classList.remove('active'));
        const active = document.getElementById(`m-${index}`);
        if (active) active.classList.add('active');
    }

    /**
     * 結果モーダルを表示する
     * @param {HTMLElement} modalEl - #result-modal 要素
     * @param {string}      title   - 大見出し（BRILLIANT! など）
     * @param {string}      msg     - 本文メッセージ
     */
    static showModal(modalEl, title, msg) {
        modalEl.style.display = 'flex';
        document.getElementById('res-title').textContent = title;
        document.getElementById('res-msg').textContent   = msg;
    }
}
